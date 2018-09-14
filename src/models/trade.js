/*
	*Trade Model
	*Author	: Saurabh Agarwal
	*Date	: July 17, 2018
*/
'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var TradeSchema = new Schema({
offerTradeId:{
	type: Schema.Types.ObjectId,
	ref: 'OfferTrade'
},
tradePitchProductId:{
	type: Schema.Types.ObjectId,
	ref: 'Product'
},
tradeSwitchProductId:{
	type: Schema.Types.ObjectId,
	ref: 'Product'
},
shippingCost:{
	type: String,
	trim: true
},

pitchUserPaymentStatus:{
  type:String,
  trim:true,
  sparse:true,
  default:0	
},
switchUserPaymentStatus:{
  type:String,
  trim:true,
  sparse:true,
  default:0	
},
switchDate:{
 type: Date, default: Date.now  
},
  Status:{
  type:String,
  trim:true,
  sparse:true,
  default:0 
 }
},
{
  timestamps:true
});

TradeSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
}
module.exports = mongoose.model('Trade', TradeSchema);
