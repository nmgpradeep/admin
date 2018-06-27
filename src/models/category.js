'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var CategorySchema = new Schema({
categoryName:{ 
 type:String,
 trim:true
},
description:{
    type:String,
    trim:true
},
parent:{
    type:String,
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

CategorySchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
   }

module.exports = mongoose.model('Category', CategorySchema);
