const express = require('express')
const router = express.Router()
// test database
const { testDB } = require('../models/connections')
// orders db definition
const orders = require('../models/orders').definition
const generics = require('./genericRoutes').addGenerics

const spike = require('../../src/spike')
const asky = require('../asky')

// IMPLIMENTS Overrides generics FINDONE
router.get('/:id', asky.decorator('read', 'orders', function (req, res) {
    testDB.then(conn => {
        spike.findOne(conn, orders, req.params.id)
            .then(data => { 
                res.sendJSON(0, data[0]) 
            })
            .catch(err => { res.sendJSON(err.message) })
    })
}))

// Wrap orders in generic api resolvers
// generics(router, testDB, orders, 'orders')

module.exports = router
