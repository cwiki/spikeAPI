const express = require('express')
const router = express.Router()
// test database
const { allcores } = require('../models/connections')
// toast db definition
const toast = require('../models/toast').definition
const generics = require('./genericRoutes').addGenerics

// Wrap toast in generic api resolvers
generics(router, allcores, toast, 'toast')
module.exports = router
