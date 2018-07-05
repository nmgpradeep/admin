const router = require('express').Router();
var passport = require('passport');
require('../config/passport')(passport);
const transactionController= require('../controllers/transactionController');
//passport.authenticate('jwt', { session: false}),
router.get('/transactions/:page', transactionController.listTransaction);
router.get('/viewTransaction/:id',transactionController.viewTransaction);
module.exports = router;
