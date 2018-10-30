'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var OfferTradeSchema = new Schema({
pitchUserId:{
 type: Schema.Types.ObjectId,
 ref: 'User'
},
SwitchUserId:{
 type: Schema.Types.ObjectId,
 ref: 'User'
},
SwitchUserProductId:{
 type: Schema.Types.ObjectId,
 ref: 'Product'
},
ditchCount:{
 type:Number,
 trim: true,
 default:0 // 0->offer/pitch,1->switch,2->ditch,3->cancelled,4->sold out,5->blocked
},
//// 0->offer/pitch,1->switch,2->ditch,3->cancelled,4->sold out,5->blocked
status:{
 type:String,
 trim:true,
 sparse:true,
 default:0
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
