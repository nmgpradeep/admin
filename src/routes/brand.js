const router = require('express').Router();
const brandController = require('../controllers/brandController');

router.post('/newBrand',brandController.createBrands)
router.get('/brands/:page', brandController.listBrands)
router.post('/sortingBrands', brandController.sortingBrands)
router.put('/updatebrand',brandController.updateBrands)
router.get('/listingbrand',brandController.listingbrand)
router.delete('/deleteBrand/:id',brandController.deleteBrands)
router.get('/viewBrand/:id', brandController.viewBrands)
module.exports = router;
