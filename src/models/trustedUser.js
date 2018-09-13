var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');
var TrustedUserSchema = new Schema({
submitUserId:{
  type:String,
  trim:true
},
userId:{
 type: Schema.Types.ObjectId,
 ref:'User'
},
tradeId:{
    type:Schema.Types.ObjectId,
    ref:'Trade'
},
review:{
    type:String,
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

TrustedUserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}
module.exports = mongoose.model('TrustedUser', TrustedUserSchema);
