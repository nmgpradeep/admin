const router = require('express').Router();
const countryController = require('../controllers/locationController')
router.post('/newCountry',countryController.createCountry)
router.get('/listCountry',countryController.listCountry)
router.get('/viewCountry/:id',countryController.viewCountry)
router.put('/updateCountry',countryController.updateCountry)
router.delete('/deleteCountry/:id',countryController.deleteCountry)
router.post('/updateStatus',countryController.updateStatus)
router.get('/Countrys/:page', countryController.listCountry)
module.exports = router;
