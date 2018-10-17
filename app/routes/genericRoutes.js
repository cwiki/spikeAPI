const { response } = require('../../src')
const spike = require('../../src/spike')
const asky = require('../asky')

/**
 * Attachces generic endpoints to a specified route
 * !! Does NOT supply any sort of permission protection
 * @param {!Object} router Express Router
 * @param {!Object} database Database used for endpoint
 * @param {!Object} definition model definition
 * @param {!Object} definition access requirements
 * @param {string} action access permission
 */
function addGenerics(router, database, definition, action) {
    // IMPLIMENTS SPIKE.FIND
    router.get('/', asky.decorator('read', action, function (req, res) {
        spike.find(database, definition, req.query)
            .then(data => res.sendJSON(0, data[0]))
            .catch(err => res.sendJSON(err.message))
    }))
    // IMPLIMENTS SPIKE.FINDONE
    router.get('/:id', asky.decorator('read', action, function (req, res) {
        spike.findOne(database, definition, req.params.id)
            .then(data => { res.sendJSON(0, data[0]) })
            .catch(err => { res.sendJSON(err.message) })
    }))
    // IMPLIMENTS SPIKE.INSERT
    // router.post('/', asky.decorator('create', action, function (req, res) {
    //     database.then(conn => {
    //         spike.insert(conn, definition, req.body).then(data => {
    //             spike.findOne(conn, definition, data[0].insertId).then(data => {
    //                 res.sendJSON(0, data[0])
    //             }).catch(err => { res.sendJSON(err.message) })
    //         }).catch(err => { res.sendJSON(err.message) })
    //     })
    // }))
    // // IMPLIMENTS SPIKE.UPDATE
    // router.patch('/:id', asky.decorator('update', action, function (req, res) {
    //     database.then(conn => {
    //         spike.update(conn, definition, req.body, req.params.id).then(data => {
    //             spike.findOne(conn, definition, req.params.id).then(data => {
    //                 res.sendJSON(0, data[0])
    //             }).catch(err => { res.sendJSON(err.message) })
    //         }).catch(err => { res.sendJSON(err.message) })
    //     })
    // }))
    // // IMPLIMENTS SPIKE.DESTROY
    router.delete('/:id', asky.decorator('delete', action, function (req, res) {
        spike.destroy(database, definition, req.params.id).then(data => {
            if (data[0].affectedRows) {
                res.sendJSON(null, 'success')
            } else {
                res.sendJSON('unable to delete object')
            }
        }).catch(err => { res.sendJSON(err.message) })
    }))
}

module.exports = {
    addGenerics
}
