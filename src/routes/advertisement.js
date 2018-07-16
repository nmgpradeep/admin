const router = require('express').Router();
const advertisementController = require('../controllers/advertisementController')
router.post('/newAds',advertisementController.create)
router.get('/list-ads',advertisementController.advertisements)
router.get('/viewAds/:id',advertisementController.viewadvertisement)
router.put('/updateAds',advertisementController.updateadvertisement)
router.delete('/deleteAds/:id',advertisementController.deleteadvertisement)
router.post('/updateStatus',advertisementController.updateStatus)
router.get('/advertisements/:page',advertisementController.advertisements)
module.exports = router;
