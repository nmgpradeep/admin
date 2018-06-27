const router = require('express').Router();
const subscriptionController= require('../controllers/subscriptionController')
router.post('/create',subscriptionController.create)
router.get('/list-subscriptions',subscriptionController.subscriptions)
router.get('/viewSubscription/:id',subscriptionController.viewSubscription)
router.put('/updateSubscription',subscriptionController.updateSubscription)
router.delete('/deleteSubscription/:id',subscriptionController.deleteSubscription)

/// Routes for addOn pack
router.post('/newAddon',subscriptionController.newAddon)
router.get('/list-addon',subscriptionController.listAddon)
router.put('/updateAddon',subscriptionController.updateAddon)
router.get('/viewAddon/:id',subscriptionController.viewAddon)
router.delete('/deleteAddon/:id',subscriptionController.deleteAddon)

module.exports = router;
