const router = require('express').Router();
var passport = require('passport');
require('../config/passport')(passport);
const tradeController= require('../controllers/tradeController');

//passport.authenticate('jwt', { session: false}),
router.get('/trades/:page', tradeController.trades);
router.post('/newTrade/', tradeController.newTrade);
module.exports = router;
