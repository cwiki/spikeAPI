const express = require('express')
const router = express.Router()
// test database
const { testDB } = require('../models/connections')
// toast db definition
const toast = require('../models/toast').definition
const generics = require('./genericRoutes').addGenerics

// Wrap toast in generic api resolvers
generics(router, testDB, toast, 'toast')
module.exports = router
