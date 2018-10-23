const express = require('express')
const router = express.Router()
// test database
const { allcores } = require('../models/connections')
// users db definition
const users = require('../models/users').definition
// const generics = require('./genericRoutes').addGenerics

// Wrap users in generic api resolvers
router.get('/me', (req, res) => {
    try {
        let oid = String(req.locals.jwt.oid)
        allcores.query('SELECT * FROM ?? WHERE `oid` = ? AND `enabled` = 1 LIMIT 1',
            [users.tableName, oid])
            .then(data => {
                const [result] = data
                res.sendJSON(null, result.shift())
            }).catch(err => {
                res.sendJSON(err.message)
            })
    } catch (err) {
        res.sendJSON('unable to lookup OID')
    }
})

module.exports = router
