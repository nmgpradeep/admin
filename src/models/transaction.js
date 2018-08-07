'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var TransactionSchema = new Schema({
transactionId:{ 
 type:String,
 trim:true
},
transactionType:{ 
 type:String,
 trim:true
},
userId:{
    type:Schema.Types.ObjectId,
    ref:'user'
},
paymentId:{
	type:String,
	trim: true
},
transactionDate:{
	type:Date,
	trim:true,
},
transactionAmount:{
 type:Number,
 trim:true
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

TransactionSchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
}
module.exports = mongoose.model('Transaction', TransactionSchema);
