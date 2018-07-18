const router = require('express').Router();
const productController = require('../controllers/productController')
router.post('/create',productController.create)
router.get('/listProduct',productController.allProducts)
router.get('/viewProduct/:id',productController.viewProduct)
router.put('/updateProduct',productController.updateProduct)
router.post('/changeStatus',productController.changeStatus)
router.get('/products/:page',productController.allProducts)
router.delete('/deleteProduct/:id',productController.deleteProduct)
module.exports = router;
