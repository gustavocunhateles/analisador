var express = require('express')
var router = express.Router()

router.use('/', require('./analise'))

module.exports = router; 