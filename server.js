const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const RateLimit = require('express-rate-limit')
const { rateLimit, hosts, environment } = require('./config')
const cors = require('cors')
const hostValidation = require('host-validation')
const { authentication, logger, sendJSON } = require('./src')

// GROUPS are context permissions for this user
function getGroups(oid) {
  return new Promise((resolve, reject) => {
    console.log(oid + ' NEED TO IMPLIMENT GROUPS')
    resolve({ admin: 1 })
  })
}

// adds sendJSON formatting helper
app.use(sendJSON)
app.use(express.static(__dirname + '/public'))
// setting up express and auth
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(hostValidation({ hosts }))
app.use(new RateLimit(rateLimit), cors())
// adds Azure authentication, or mocks a JWT
app.use(authentication(environment))

app.use((req, res, next) => {
  // Verify user has JWT and assign context
  if ((req.locals || 0) && (req.locals.jwt || 0) && (req.locals.jwt.oid)) {
    // adding user CPRM
    getGroups(req.locals.jwt.oid).then(groups => {
      req.locals.groups = groups
      next()
    }).catch(err => {
      res.setStatus = 500
      res.end('Unable to assign user level access')
    })
  } else {
    res.setStatus = 401
    res.end('Authentication method not recognized')
  }
  // add json output wrapper
})

// add api
app.use(require('./app'))

// api hook
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
