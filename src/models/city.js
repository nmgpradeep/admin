/* City Model
* Author    : Saurabh Agarwal
* Date  : July 17, 2018
*/
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var CitySchema = new Schema({
countrySelect:{ 
 type:Schema.Types.ObjectId,
 ref: 'Country'
},
stateSelect:{
    type:Schema.Types.ObjectId,
    ref: 'State'
},
cityName: {
    type: String,
    trim: true,
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

CitySchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
   }
module.exports = mongoose.model('City', CitySchema);
