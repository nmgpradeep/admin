const express =require('express')
const app =express()
const cors = require('cors')
const router=express.Router()
const config=require('./config/db')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser=require('body-parser')
const user = require('./routes/user')
const category = require('./routes/category')
const product = require('./routes/product')
const subscription = require('./routes/subscription')
const donation = require('./routes/donation')
const advertisement = require('./routes/advertisement')
const testimonial = require('./routes/testimonial')
const brand = require('./routes/brand')
const size = require('./routes/size')
const page = require("./routes/page")
const trade = require("./routes/trade")
const transaction = require("./routes/transaction")
const morgan=require('morgan')
const http = require('http');
const fs = require('fs');
//mongoose.connect(config.db)
mongoose.connect('mongodb://pitchnswitch:nmg251@ds147450.mlab.com:47450/pitch-switch');
app.set('port', (5000));
app.use(cors());
app.get('/',(req,res)=>{
 res.json('Welcome to pitch & switch')
})
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

app.use(morgan('dev'));
app.use('/user', user);
app.use('/category', category);
app.use('/product', product);
app.use('/subscription',subscription);
app.use('/donation',donation);
app.use('/advertisement',advertisement);
app.use('/testimonial',testimonial)
app.use('/brand',brand)
app.use('/size',size)
app.use('/page',page);
app.use('/trade',trade);
app.use('/transaction',transaction);
app.listen(app.get('port'), () => console.log('Server running on ' + app.get('port')));
module.exports = app;
