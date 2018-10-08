const router = require('express').Router();
const subscriptionController= require('../controllers/subscriptionController')
router.post('/newSubscription',subscriptionController.create)
router.get('/subscriptions/:page',subscriptionController.subscriptions)
router.get('/list-subscriptions',subscriptionController.listSubscriptionPlans)
router.get('/viewSubscription/:id',subscriptionController.viewSubscription)
router.put('/updateSubscription',subscriptionController.updateSubscription)
router.post('/changeStatus',subscriptionController.changeStatus)
router.delete('/deleteSubscription/:id',subscriptionController.deleteSubscription)
router.get('/unlimited/', subscriptionController.unlimited)
router.post('/unlimited/', subscriptionController.unlimited)
router.get('/listingsubscription/', subscriptionController.listingsubscription)

/// Routes for addOn pack
router.post('/newAddon',subscriptionController.newAddon)
router.get('/list-addon',subscriptionController.listAddon)
router.put('/updateAddon',subscriptionController.updateAddon)
router.get('/viewAddon/:id',subscriptionController.viewAddon)
router.delete('/deleteAddon/:id',subscriptionController.deleteAddon)
router.post('/updateStatus',subscriptionController.updateStatus)
router.get('/addons/:page', subscriptionController.listAddon)

// routes for user subscription plan
router.post('/saveUserSubscriptionPlan',subscriptionController.saveUserSubscriptionPlan)
router.post('/payOnStripe',subscriptionController.payOnStripe)

module.exports = router;
