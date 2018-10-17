const express = require('express')
const router = express.Router()
// test database
const { allcores } = require('../models/connections')
// users db definition
const users = require('../models/users').definition
const generics = require('./genericRoutes').addGenerics

// Wrap users in generic api resolvers
generics(router, allcores, users, 'users')
module.exports = router
