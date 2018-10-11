'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var UserSubscriptionSchema = new Schema({

userId:{
     type: Schema.Types.ObjectId,
     ref: 'User'
},

subscriptionId:{
  type: Schema.Types.ObjectId,
  ref: 'Subscription'
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

UserSubscriptionSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
}

module.exports = mongoose.model('UserSubscription', UserSubscriptionSchema);
