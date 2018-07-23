const router = require('express').Router();
const donationController= require('../controllers/donationController')
router.post('/donate',donationController.create)
router.get('/donation',donationController.donations)
router.get('/getConstant',donationController.getConstant)
router.get('/viewDonation/:id',donationController.viewDonation)
router.put('/updateDonation',donationController.updateDonation)
router.delete('/deleteDonation/:id',donationController.deleteDonation)
router.post('/updateStatus',donationController.updateStatus)
router.get('/donations/:page',donationController.donations)

module.exports = router;
