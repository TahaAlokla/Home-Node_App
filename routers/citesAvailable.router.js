const router = require('express').Router();

const citesAvailableController = require('../controllers/citesAvailable.controller')


router.get('/', citesAvailableController.getAllCitesAvailable)


module.exports= router;