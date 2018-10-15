const express = require('express')
const router = express.Router()

// const multer = require('multer')
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         console.log(file)
//         let fileName = file.originalname.split('.')
//         cb(null, file.fieldname + fileName.pop())
//     }
// })
// const upload = multer({storage})
// router.post('/profile', upload.single('avatar'), function (req, res, next) {
//     // req.file is the `avatar` file
//     // req.body will hold the text fields, if there were any
//     console.log(req.body)
//     res.send('upload completo')
// })

router.use('/toast', require('./routes/toast'))
router.use('/orders', require('./routes/orders'))

module.exports = router