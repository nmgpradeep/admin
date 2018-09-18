var mongoose = require('mongoose');

var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');
var UserTradeRetingSchema = new Schema({	
submitUserId:{
  type:Schema.Types.ObjectId,
  trim:'User'
},
userId:{
	 type:Schema.Types.ObjectId,
	 ref:'User'
},
tradeId:{
    type:Schema.Types.ObjectId,
    ref:'Trade'
},
review:{
    type:Number,
    trim:true
},
status:{
  type:String,
  trim:true,
  sparse:true,
  default:0
},
},
{
 timestamps:true
});

// Getter
UserTradeRetingSchema.path('review').get(function(num) {
  return (num / 10).toFixed(2);
});

// Setter
UserTradeRetingSchema.path('review').set(function(num) {
  return num * 10;
});

UserTradeRetingSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
}
module.exports = mongoose.model('UserTradeRating', UserTradeRetingSchema);
