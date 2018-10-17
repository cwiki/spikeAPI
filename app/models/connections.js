const mysql = require('mysql2/promise')
const { databases } = require('../../config')

// TEST DATABASE CONNECTION
const allcores = mysql.createConnection(databases.allcores).catch(err => {
    console.warn('failed to connect to the test database')
    console.error(err.message)
})

module.exports = {
    allcores
}