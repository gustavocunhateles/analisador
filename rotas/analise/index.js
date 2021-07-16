var express = require('express')
var router = express.Router()

router.get('/analise', (req, res) => {
    res.json({
        ip: '192.168.1.1',
        rsa: 'BEGIN RSA PRIVATE KEY iugbdhdvv END RSA PRIVATE KEY',
        dsa: 'BEGIN DSA PRIVATE KEY knKJdDsAB END DSA PRIVATE KEY'
    })
})

module.exports = router; 