'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
relationship = require("mongoose-relationship");
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
    type:Schema.Types.ObjectId,
    ref:'category'
},
status:{
 type:String,
 trim:true,
 sparse:true,
 default:0
},
children:[{ type:Schema.ObjectId, ref:"ParentCategory" }, { type:Schema.ObjectId, ref:"Product" }]
},
{
timestamps:true
});

//~ var autoPopulateChildren = function(next) {
    //~ this.populate('children');
    //~ next();
//~ };
//~ CategorySchema
//~ .pre('findOne', autoPopulateChildren)
//~ .pre('find', autoPopulateChildren);

// module.exports = mongoose.model('ParentCategory', CategorySchema);
module.exports = mongoose.model('Category', CategorySchema);
