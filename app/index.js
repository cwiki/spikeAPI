const express = require('express')
const router = express.Router()

router.use('/users', require('./routes/users'))
router.use('/toast', require('./routes/toast'))
// router.use('/orders', require('./routes/orders'))

module.exports = router