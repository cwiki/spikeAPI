const express = require('express')
const router = express.Router()
const { response } = require('../../src')
const spike = require('../../src/spike')
// test database
const { testDB } = require('../models/connections')
// toast db definition
const toast = require('../models/toast').definition

// IMPLIMENTS SPIKE.FIND
router.get('/', function (req, res) {
  testDB.then(conn => {
    spike.find(conn, toast, req.query)
      .then(data => res.sendJSON(0, data[0]))
      .catch(err => res.sendJSON(err.message))
  })
})
// IMPLIMENTS SPIKE.FINDONE
router.post('/', function (req, res) {
  testDB.then(conn => {
    spike.insert(conn, toast, req.body).then(data => {
      spike.findOne(conn, toast, data[0].insertId).then(data => {
        res.sendJSON(0, data[0])
      }).catch(err => { res.sendJSON(err.message) })
    }).catch(err => { res.sendJSON(err.message) })
  })
})
// IMPLIMENTS SPIKE.FINDONE
router.get('/:id', function (req, res) {
  testDB.then(conn => {
    spike.findOne(conn, toast, req.params.id)
      .then(data => { res.sendJSON(0, data[0]) })
      .catch(err => { res.sendJSON(err.message) })
  })
})
// IMPLIMENTS SPIKE.UPDATE
router.patch('/:id', function (req, res) {
  testDB.then(conn => {
    spike.update(conn, toast, req.body, req.params.id).then(data => {
      spike.findOne(conn, toast, req.params.id).then(data => {
        res.sendJSON(0, data[0])
      }).catch(err => { res.sendJSON(err.message) })
    }).catch(err => { res.sendJSON(err.message) })
  })
})
// IMPLIMENTS SPIKE.DESTORY
router.delete('/:id', function (req, res) {
  connection.then(conn => {
    spike.destroy(conn, toast, req.params.id).then(data => {
      if (data[0].affectedRows) {
        res.sendJSON(null, 'success')
      } else {
        res.sendJSON('unable to delete object')
      }
    }).catch(err => { res.sendJSON(err.message) })
  })
})
module.exports = router
