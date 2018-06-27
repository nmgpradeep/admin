const router = require('express').Router();
const productController= require('../controllers/productController')
router.post('/create',productController.create)
router.get('/products',productController.products)
router.get('/viewProduct/:id',productController.viewProduct)
router.put('/updateProduct',productController.updateProduct)
router.delete('/deleteProduct/:id',productController.deleteProduct)
module.exports = router;
