const router = require('express').Router();
const sizeController = require('../controllers/sizeController');
router.get('/listingsize',sizeController.listingsize)
router.post('/newSize',sizeController.createSizes)
router.post('/sortingSizes',sizeController.sortingSizes)
router.get('/sizes/:page', sizeController.listSizes)
router.put('/updateSize',sizeController.updateSizes)
router.delete('/deleteSize/:id',sizeController.deleteSizes)
router.get('/viewSize/:id', sizeController.viewSizes)
module.exports = router;
