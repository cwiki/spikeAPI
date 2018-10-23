const express = require('express')

const bodyParser = require('body-parser')
const cors = require('cors')
const RateLimit = require('express-rate-limit')
const hostValidation = require('host-validation')

const { rateLimit, hosts, environment } = require('./config')
const { authentication, logger, sendJSON, authorizationGroups, authenticationCheck } = require('./src')

const app = express()
const port = 3000

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
