const router = require('express').Router();
const locationController = require('../controllers/locationController')
//country routes
router.post('/newCountry',locationController.createCountry)
router.get('/listCountry',locationController.listCountry)
router.get('/viewCountry/:id',locationController.viewCountry)
router.put('/updateCountry',locationController.updateCountry)
router.delete('/deleteCountry/:id',locationController.deleteCountry)
router.post('/updateStatus',locationController.updateStatus)
router.get('/Countrys/:page', locationController.listCountry)
//State routes
router.post('/newState',locationController.createStates)
router.get('/listState',locationController.listStates)
router.get('/viewState/:id',locationController.viewStates)
router.put('/updateState',locationController.updateStates)
router.delete('/deleteState/:id',locationController.deleteStates)
router.post('/changeStatus',locationController.changeStatus)
router.get('/States/:page', locationController.listStates)
//City routes
router.post('/newCity',locationController.createCitys)
router.get('/listCity',locationController.listCitys)
router.get('/viewCity/:id',locationController.viewCitys)
router.put('/updateCity',locationController.updateCitys)
router.delete('/deleteCity/:id',locationController.deleteCitys)
router.post('/status',locationController.Status)
router.get('/Citys/:page', locationController.listCitys)
module.exports = router;