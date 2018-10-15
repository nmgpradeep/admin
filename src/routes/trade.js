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
router.post('/cancelOfferTrade',tradeController.cancelOfferTrade)
router.post('/switchTrade',tradeController.switchTrade)
router.get('/switchTrades',tradeController.switchTrades)
router.get('/completedTrades',tradeController.completedTrades)
router.post('/ditchTrade',tradeController.ditchTrade)
router.post('/ditchOfferTrade',tradeController.ditchOfferTrade)
router.get('/ditchTrades',tradeController.ditchTrades)
router.get('/tradingProduct/:id',tradeController.tradingProduct)

// Routes related to trade pitch products
router.post('/tradePitchProduct',tradeController.tradePitchProduct)
router.get('/offerTradeProduct/:id',tradeController.offerTradeProduct)
router.get('/getAllProduct',tradeController.getAllProduct)
router.get('/getProductByCategory/:id',tradeController.getProductByCategory)
router.post('/submitPitchProduct/',tradeController.submitPitchProduct)

module.exports = router;
