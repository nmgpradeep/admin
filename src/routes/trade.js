const router = require('express').Router();
const tradeController= require('../controllers/tradeController');
router.post('/newTrade',tradeController.newTrades)
router.get('/listTrade',tradeController.listTrades)
router.post('/returnraised',tradeController.returnraised)
router.get('/viewTrade/:id',tradeController.viewTrades)
router.post('/updateStatus',tradeController.updateStatus)
router.get('/Trades/:page', tradeController.listTrades)
module.exports = router;
