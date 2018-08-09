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
sellerId:{
	type: Schema.Types.ObjectId,
	ref: 'User'
},
receiverId:{
	type: Schema.Types.ObjectId,
	ref: 'User'
},
sellerProductId:{
	type: Schema.Types.ObjectId,
    ref: 'Product'
},
receiverProductId:{
	type: Schema.Types.ObjectId,
	ref: 'Product'
},
Status:{
  type:String,
  trim:true,
  sparse:true,
  default:0 
},
sendReturnStatus:{
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
