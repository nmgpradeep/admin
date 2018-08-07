const router = require('express').Router();
var passport = require('passport');
require('../config/passport')(passport);
const transactionController= require('../controllers/transactionController');
//passport.authenticate('jwt', { session: false}),
router.get('/viewTransaction/:id',transactionController.viewTransaction);
router.get('/transactions/:page', transactionController.listTransaction);
router.post('/changeStatus',transactionController.changeStatus);
router.post('/searchQuery',transactionController.searchQuery);
router.get('/transactions',transactionController.transactions)
module.exports = router;
