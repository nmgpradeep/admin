const router = require('express').Router();
const donationController= require('../controllers/donationController')
router.post('/donate',donationController.create)
router.get('/donations',donationController.donations)
router.get('/viewDonation/:id',donationController.viewDonation)
router.put('/updateDonation',donationController.updateDonation)
router.delete('/deleteDonation/:id',donationController.deleteDonation)
router.post('/updateStatus',donationController.updateStatus)
module.exports = router;
