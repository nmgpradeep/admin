'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var userSubscriptionAddonsSchema = new Schema({

userId:{
     type: Schema.Types.ObjectId,
     ref: 'User'
},
userSubscriptionId:{
  type: Schema.Types.ObjectId,
  ref: 'UserSubscription'
},

addonId:{
  type: Schema.Types.ObjectId,
  ref: 'Addon'
},
transactionId:{
 type:String,
 trim: true
},
transactionStatus:{
 type:String,
 trim: true,
 default:0
},
transactionResponceMessage:{
 type:String,
 trim: true,
 default:null
},
transactionAmount:{
 type:String,
 trim: true,
 default:0
},
transactionDate:{
	type: Date, default: Date.now 
},
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

userSubscriptionAddonsSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
}

module.exports = mongoose.model('userSubscriptionAddons', userSubscriptionAddonsSchema);
