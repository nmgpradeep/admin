const router = require('express').Router();
const tradeController= require('../controllers/tradeController');

//Routes Related to trades
router.post('/newTrade',tradeController.newTrades)
router.get('/listTrade',tradeController.listTrades)
router.post('/returnraised',tradeController.returnraised)
router.get('/viewTrade/:id',tradeController.viewTrades)
router.post('/updateStatus',tradeController.updateStatus)
router.get('/Trades/:page', tradeController.listTrades)
router.get('/switchedTrades/:page', tradeController.switchedTrades)
router.get('/tradeStatus', tradeController.tradeStatus)
router.post('/updateShippingStatus',tradeController.updateShippingStatus)

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

//Routes related to trade pitch products
router.post('/tradePitchProduct',tradeController.tradePitchProducts)
router.get('/offerTradeProduct/:id',tradeController.offerTradeProduct)
router.get('/getAllProduct',tradeController.getAllProduct)
router.get('/getProductByCategory/:id',tradeController.getProductByCategory)
router.post('/submitPitchProduct/',tradeController.submitPitchProduct)
router.post('/submitTradeProduct/',tradeController.submitTradeProduct)
router.get('/pitchedProductList/:id',tradeController.pitchedProductList)
router.post('/submitReview/',tradeController.submitReview)
router.post('/returnTrade/',tradeController.returnTrade)
router.get('/switchedProduct/:id',tradeController.switchedProduct)
router.post('/submitPitchAgain/',tradeController.submitPitchAgain)

module.exports = router;
