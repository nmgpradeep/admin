'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var SwitchProductShippingSchema = new Schema({
	
TradeId:{ 
  type: Schema.Types.ObjectId,
  ref: 'Trade'
},
switchUserId:{
  type: Schema.Types.ObjectId,
  ref: 'User'
},

comments:{
	 type: String,
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

SwitchProductShippingSchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
}
module.exports = mongoose.model('SwitchProductShipping', SwitchProductShippingSchema);
