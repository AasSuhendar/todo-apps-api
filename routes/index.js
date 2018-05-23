var express = require('express')
var router = express.Router()
/* GET home page. */
router.get('/', function (req, res) {
  res.status(200).send({
    status: true,
    code: 'GET-MAIN-ENDPOINT-API',
    message: 'Wellcome to TODO Apps API'
  })
})

module.exports = router
