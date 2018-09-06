//'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var TradePitchProductSchema = new Schema({
	
offerTradeId:{ 
 type: Schema.Types.ObjectId,
 ref: 'OfferTrade'
},
ProductId1:{
 type:String,
 trim: true
},
ProductId2:{
 type:String,
 trim: true
},
ProductId3:{
 type:String,
 trim: true
},
status:{
  type:String,
  trim:true,
  sparse:true
 }
},
{
timestamps:true
});

TradePitchProductSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
}

module.exports = mongoose.model('TradePitchProduct', TradePitchProductSchema);
