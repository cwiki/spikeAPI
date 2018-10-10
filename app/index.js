const express = require('express')
const router = express.Router()
const { response } = require('./src')
const spike = require('./src/spike')

const mysql = require('mysql2/promise')
const connection = mysql.createConnection({
  // 'host': 'host.docker.internal',
  'host': 'localhost',
  'user': 'root',
  'password': 'root',
  'database': 'test_db',
  // 'debug': true
}).catch(err => {
  console.warn('failed to connect to the test database')
  console.error(err.message)
})

const toast = {
  tableName: 'toast_soft',
  primaryField: 'id',
  softDeleteField: "deleted_at",
  searchFields: ['id', 'name'],
}

router.get('/toast', function (req, res) {
  connection.then(conn => {
    spike.find(conn, toast, req.query)
      .then(data => res.sendJSON(0, data[0]))
      .catch(err => res.sendJSON(err.message))
  })
})

router.post('/toast', function (req, res) {
  connection.then(conn => {
    spike.insert(conn, toast, req.body).then(data => {
      spike.findOne(conn, toast, data[0].insertId).then(data => {
        res.sendJSON(0, data[0])
      }).catch(err => { res.sendJSON(err.message) })
    }).catch(err => { res.sendJSON(err.message) })
  })
})

router.get('/toast/:id', function (req, res) {
  connection.then(conn => {
    spike.findOne(conn, toast, req.params.id)
      .then(data => { res.sendJSON(0, data[0]) })
      .catch(err => { res.sendJSON(err.message) })
  })
})

router.patch('/toast/:id', function (req, res) {
  connection.then(conn => {
    spike.update(conn, toast, req.body, req.params.id).then(data => {
      spike.findOne(conn, toast, req.params.id).then(data => {
        res.sendJSON(0, data[0])
      }).catch(err => { res.sendJSON(err.message) })
    }).catch(err => { res.sendJSON(err.message) })
  })
})

router.delete('/toast/:id', function (req, res) {
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

module.exports.bootstrap = (app) => {
  app.use('/', router)
}
