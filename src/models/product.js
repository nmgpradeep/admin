'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
  relationship = require("mongoose-relationship");
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
},
parent: { type:Schema.ObjectId, ref:"Category", childPath:"child" }
},
{
timestamps:true
});

ProductSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
   }


ProductSchema.methods.getCategory = function(callback) {
  var product = this;
  var productCategoryID = this.productCategory.map(function(productCategory) {
    return productCategory.product_id;
  }); 
};


ProductSchema.plugin(relationship, { relationshipPathName:'parent' });

module.exports = mongoose.model('Product', ProductSchema);
