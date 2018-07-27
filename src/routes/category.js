const router = require('express').Router();
const categoryController= require('../controllers/categoryController')
router.post('/create',categoryController.create)
router.get('/allCategories',categoryController.allCategories)
router.get('/viewCategory/:id',categoryController.viewCategory)
router.get('/categories/:page',categoryController.categories)
router.put('/updateCategory',categoryController.updateCategory)
router.post('/changeStatus',categoryController.changeStatus);
router.delete('/deleteCategory/:id',categoryController.deleteCategory)
module.exports = router;
