const { response } = require('../../src')
const spike = require('../../src/spike')
const cp = require('../context')

/**
 * Attachces generic endpoints to a specified route
 * !! Does NOT supply any sort of permission protection
 * @param {!Object} router Express Router
 * @param {!Object} database Database used for endpoint
 * @param {!Object} definition model definition
 * @param {!Object} definition access requirements
 */
function addGenerics(router, database, definition, requires) {
    // IMPLIMENTS SPIKE.FIND
    router.get('/', function (req, res) {
        // cp.requires(requires, req.locals.cprm)
        database.then(conn => {
            spike.find(conn, definition, req.query)
                .then(data => res.sendJSON(0, data[0]))
                .catch(err => res.sendJSON(err.message))
        })
    })
    // IMPLIMENTS SPIKE.INSERT
    router.post('/', function (req, res) {
        database.then(conn => {
            spike.insert(conn, definition, req.body).then(data => {
                spike.findOne(conn, definition, data[0].insertId).then(data => {
                    res.sendJSON(0, data[0])
                }).catch(err => { res.sendJSON(err.message) })
            }).catch(err => { res.sendJSON(err.message) })
        })
    })
    // IMPLIMENTS SPIKE.FINDONE
    router.get('/:id', function (req, res) {
        database.then(conn => {
            spike.findOne(conn, definition, req.params.id)
                .then(data => { res.sendJSON(0, data[0]) })
                .catch(err => { res.sendJSON(err.message) })
        })
    })
    // IMPLIMENTS SPIKE.UPDATE
    router.patch('/:id', function (req, res) {
        database.then(conn => {
            spike.update(conn, definition, req.body, req.params.id).then(data => {
                spike.findOne(conn, definition, req.params.id).then(data => {
                    res.sendJSON(0, data[0])
                }).catch(err => { res.sendJSON(err.message) })
            }).catch(err => { res.sendJSON(err.message) })
        })
    })
    // IMPLIMENTS SPIKE.DESTROY
    router.delete('/:id', function (req, res) {
        connection.then(conn => {
            spike.destroy(conn, definition, req.params.id).then(data => {
                if (data[0].affectedRows) {
                    res.sendJSON(null, 'success')
                } else {
                    res.sendJSON('unable to delete object')
                }
            }).catch(err => { res.sendJSON(err.message) })
        })
    })
}

module.exports = {
    addGenerics
}
