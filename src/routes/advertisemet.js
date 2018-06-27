const router = require('express').Router();
const advertisemetController = require('../controllers/advertisemetController')
router.post('/newAds',advertisemetController.create)
router.get('/list-ads',advertisemetController.advertisemets)
router.get('/viewAds/:id',advertisemetController.viewAdvertisemet)
router.put('/updateAds',advertisemetController.updateAdvertisemet)
router.delete('/deleteAds/:id',advertisemetController.deleteAdvertisemet)
router.post('/updateStatus',advertisemetController.updateStatus)
module.exports = router;
