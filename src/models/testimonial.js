/* Testimonial Model
* Author    : Saurabh Agarwal
* Date  : July 6, 2018
*/
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var TestimonialSchema = new Schema({
title:{ 
 type:String,
 trim:true
},
description:{
    type:String,
    trim:true
},
author: { 
	type: Schema.Types.ObjectId, 
	ref: 'User' 
},
review: { 
	type: Number, 
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

TestimonialSchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
   }
module.exports = mongoose.model('Testimonial', TestimonialSchema);
