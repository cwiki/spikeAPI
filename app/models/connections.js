const mysql = require('mysql2/promise')
const { databases } = require('../../config')

// Allcores connection pool
const allcores = mysql.createPool(databases.allcores)

module.exports = {
    allcores
}