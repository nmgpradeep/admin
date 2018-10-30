const router = require('express').Router();
const productController = require('../controllers/productController')
router.post('/create',productController.create)
router.get('/listProduct',productController.allProducts)
router.get('/viewProduct/:id',productController.viewProduct)
router.put('/updateProduct',productController.updateProduct)
router.post('/changeStatus',productController.changeStatus)
router.get('/products/:page',productController.allProducts)
router.delete('/deleteProduct/:id',productController.deleteProduct)
router.get('/switchTodays',productController.switchTodays)
router.get('/popularItems',productController.popularItems)
router.get('/myTreasureChest',productController.myTreasureChest)
router.post('/addProduct',productController.addProduct)
router.post('/tepmUpload',productController.tepmUpload)
router.get('/activeProducts',productController.activeProducts)
router.get('/searchresult/:id?/:latitude?/:longitude?',productController.searchresult)
router.post('/filterBy',productController.myTreasureChestFilterBy)
router.post('/filterBycategory',productController.filterBycategory)
router.get('/productDetails/:id',productController.productDetails)
router.get('/productImages/:id',productController.productDetails)
router.get('/relatedCategoryProduct/:id',productController.relatedCategoryProduct)


/*Routes related to user wishlist functionality added on 03 October 2018 */
router.get('/wishlist',productController.wishList)
router.post('/addToWishList',productController.addToWishList)
router.delete('/clearWishlist',productController.clearWishlist)
router.post('/checkExists',productController.checkExists)
module.exports = router;
