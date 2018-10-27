var mongoose = require('mongoose');
var SchemaTypes = mongoose.Schema.Types;

var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var UserTradeRatingSchema = new Schema({
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
comment:{
  type:String,
  defult:null	
},
review:{
    type:Number,
    trim:true,
    defult:0
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
UserTradeRatingSchema.path('review').get(function(num) {
  return (num / 10).toFixed(2);
});
UserTradeRatingSchema.path('review').set(function(num) {
  return num * 10;
});

UserTradeRatingSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
}
module.exports = mongoose.model('UserTradeRating', UserTradeRatingSchema);
