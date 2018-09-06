'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var OfferTradeSchema = new Schema({
pitchUserId:{ 
 type: Schema.Types.ObjectId,
 ref: 'USer'
},
SwitchUserId:{
 type: Schema.Types.ObjectId,
 ref: 'USer'
},
SwitchUserProductId:{
 type: Schema.Types.ObjectId,
 ref: 'Product'
},
ditchCount:{
 type:Number,
 trim: true
},
//
status:{
 type:String,
 trim:true,
 sparse:true
}
},
{
timestamps:true
});

OfferTradeSchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
}

module.exports = mongoose.model('offerTrade', OfferTradeSchema);
