var express = require('express');
var router = express.Router();
const serviceController = require('../controllers/service.controller')


router.get('/viewServices',serviceController.viewServices)


module.exports = router;