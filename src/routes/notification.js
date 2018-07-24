const router = require('express').Router();
var passport = require('passport');
require('../config/passport')(passport);
const notificationController= require('../controllers/notificationController');
//passport.authenticate('jwt', { session: false}),
router.get('/email/',notificationController.emailNotification);
router.post('/email/',notificationController.emailNotificationUpdate);
module.exports = router;
