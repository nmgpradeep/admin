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
const location = require("./routes/location")
const transaction = require("./routes/transaction")
const notification = require("./routes/notification")
const morgan=require('morgan')
const http = require('http');
const fs = require('fs');
const constant = require('../common/constant')
var cookieParser = require('cookie-parser');
var session = require('express-session')
var auth = require('./routes/auth');

//database connection
mongoose.connect(constant.DATABASE)

//mongoose.connect('mongodb://pitchswitch:nmg251@ds251622.mlab.com:51622/pitch-switch');
//mongoose.connect('mongodb://pitchswitch:nmg251@ds213183.mlab.com:13183/pitch-switch-demo');
//mongoose.connect('mongodb://pitchnswitch:pitchnswitch123456@10.0.0.24:27017/pitch-switch-demo');

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
app.use(cookieParser());
app.use(morgan('dev'));
//Exoress session object
app.set('trust proxy', 1) // trust first proxy
var MemoryStore =session.MemoryStore;
app.use(session({
  key: 'userId',
  secret: 'pitchandswitch',
  resave: false,
  store: new MemoryStore(),
  saveUninitialized: false,
  cookie: { secure: true },
  cookie: {
		maxAge: 1200000 ,
		expires: new Date(Date.now() + 1200000)
	  }

}))

app.use((req, res, next) => {
    if (req.cookies.userId && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

app.use('/user', user);
app.use('/api/auth', auth);
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
app.use('/location',location)
app.use('/transaction',transaction);
app.use('/notification',notification);
app.listen(app.get('port'), () => console.log('Server running on ' + app.get('port')));
module.exports = app;
