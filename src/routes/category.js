const router = require('express').Router();
const categoryController= require('../controllers/categoryController')
router.post('/create',categoryController.create)
router.get('/categories',categoryController.categories)
router.get('/viewCategory/:id',categoryController.viewCategory)
router.put('/updateCategory',categoryController.updateCategory)
router.delete('/deleteCategory/:id',categoryController.deleteCategory)
module.exports = router;
