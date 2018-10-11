const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const RateLimit = require('express-rate-limit')
const { rateLimit, hosts, environment } = require('./config')
const cors = require('cors')
const hostValidation = require('host-validation')
const { authentication, logger } = require('./app/src')

// setting up express and auth
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(hostValidation({ hosts }))
app.use(new RateLimit(rateLimit), cors())
// adds Azure authentication, or mocks a JWT
app.use(authentication(environment))
app.use((req, res, next) => {
  // Verify user has JWT and assign context
  if ((req.locals || 0) && (req.locals.jwt || 0)) {
    next()
  } else {
    res.setStatus = 401
    res.end('Authentication method not recognized')
  }
  // add json output wrapper
  res.sendJSON = function (err, data, meta) {
    if (!err) err = undefined
    if (err) {
      this.status(500)
      err = { level: err.level || 'info', message: err.message || err }
      logger.log(err.level, err.message)
    }
    this.send({ err, data, meta })
  }
})

// add api
app.use('/', require('./app/routes/toast'))

// api hook
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
