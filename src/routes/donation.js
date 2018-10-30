const router = require('express').Router();
const donationController= require('../controllers/donationController')
router.post('/donate',donationController.create)
router.get('/donation',donationController.donations)
router.get('/viewuser/:id',donationController.viewuser)
router.get('/getConstant',donationController.getConstant)
router.get('/getdonationStatus',donationController.getdonationStatus)
router.get('/getdonationshippingStatus',donationController.getdonationshippingStatus)
router.get('/viewDonation/:id',donationController.viewDonation)
router.put('/updateDonation',donationController.updateDonation)
router.delete('/deleteDonation/:id',donationController.deleteDonation)
router.post('/updateStatus',donationController.updateStatus)
router.get('/donations/:page',donationController.donations)

// Router for front users
router.get('/donatedProducts',donationController.donatedProducts)
router.post('/donateProduct',donationController.donateProduct)
router.get('/getReturnOption',donationController.getReturnOption)

module.exports = router;
