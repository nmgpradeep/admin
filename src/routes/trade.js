const router = require('express').Router();
const tradeController= require('../controllers/tradeController');

//Routes Related to trades
router.post('/newTrade',tradeController.newTrades)
router.get('/listTrade',tradeController.listTrades)
router.post('/returnraised',tradeController.returnraised)
router.get('/viewTrade/:id',tradeController.viewTrades)
router.post('/updateStatus',tradeController.updateStatus)
router.get('/Trades/:page', tradeController.listTrades)


// Routes related to OfferTrades
router.post('/offerTrade',tradeController.offerTrade)
router.get('/offerTrades',tradeController.offerTrades)


// Routes related to trade pitch products
router.post('/tradePitchProduct',tradeController.tradePitchProduct)

module.exports = router;
