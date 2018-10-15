const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const RateLimit = require('express-rate-limit')
const { rateLimit, hosts, environment } = require('./config')
const cors = require('cors')
const hostValidation = require('host-validation')

const { authentication, logger, sendJSON, authorizationGroups, authenticationCheck } = require('./src')

// adds sendJSON formatting helper
app.use(express.static(__dirname + '/public'))
// setting up express and auth
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(hostValidation({ hosts }))
app.use(new RateLimit(rateLimit), cors())
// adds Azure authentication, or mocks a JWT
app.use(authentication(environment))
app.use(sendJSON, authenticationCheck, authorizationGroups)

// add api
app.use(require('./app'))

// api hook
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
