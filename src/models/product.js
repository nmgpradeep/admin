'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var ProductSchema = new Schema({
productName:{ 
 type:String,
 trim:true
},
description:{
    type:String,
    trim:true
},
userId:{
     type: Schema.Types.ObjectId,
     ref: 'user'
},
productCategory:{
	type: Schema.Types.ObjectId,
    ref: 'category'
},
size:{
type:String,
trim: true
},
color:{
type:String,
trim:true,
},
brand:{
type:String,
trim:true
},
productAge:{
type:String,
trim:true
},
productStatus:{
 type:String,
 trim:true,
 sparse:true,
 default:0   
}
},
{
timestamps:true
});

ProductSchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
   }

module.exports = mongoose.model('Product', ProductSchema);
