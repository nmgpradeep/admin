'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var PitchProductShippingSchema = new Schema({
	
TradeId:{ 
 type: Schema.Types.ObjectId,
 ref: 'Trade'
},

pitchUserId:{
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

PitchProductShippingSchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
}
module.exports = mongoose.model('PitchProductShipping', PitchProductShippingSchema);
