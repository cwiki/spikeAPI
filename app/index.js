const express = require('express')
const router = express.Router()

router.use('/toast', require('./routes/toast'))

module.exports = router