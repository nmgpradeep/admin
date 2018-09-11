/* State Model
* Author    : Saurabh Agarwal
* Date  : July 17, 2018
*/
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var StateSchema = new Schema({
country:{ 
  type:Schema.Types.ObjectId,
  ref: 'Country'
},
stateName:{
    type:String,
    trim:true
},
status:{
 type:String,
 trim:true,
 sparse:true 
},
},
{
timestamps:true
});

StateSchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
   }
module.exports = mongoose.model('State',StateSchema);
