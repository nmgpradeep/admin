const router = require('express').Router();
const pageController = require('../controllers/pageController')
router.post('/newPage',pageController.create)
router.get('/pages',pageController.pages)
router.get('/viewPage/:id',pageController.viewPage)
router.put('/updatePage',pageController.updatePage)
router.delete('/deletePage/:id',pageController.deletePage)
router.post('/updateStatus',pageController.updateStatus)
module.exports = router;
