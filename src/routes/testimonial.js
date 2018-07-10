const router = require('express').Router();
const testimonialController = require('../controllers/testimonialController')
router.post('/newTestimonial',testimonialController.createTestimonials)
router.get('/listTestimonial',testimonialController.listTestimonials)
router.get('/viewTestimonial/:id',testimonialController.viewTestimonials)
router.put('/updateTestimonial',testimonialController.updateTestimonials)
router.delete('/deleteTestimonial/:id',testimonialController.deleteTestimonials)
router.post('/updateStatus',testimonialController.updateStatus)
router.get('/Testimonials/:page', testimonialController.listTestimonials)
module.exports = router;
