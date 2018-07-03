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
    type:String,
    trim:true
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
// module.exports = mongoose.model('ParentCategory', CategorySchema);
module.exports = mongoose.model('Category', CategorySchema);
// var ChildSchema = {...CategorySchema, parent: { type:Schema.ObjectId, ref:"ParentCategory", childPath:"children" }};
//
// ChildSchema.plugin(relationship, { relationshipPathName:'parent' });
//
// CategorySchema.methods.toJSON = function() {
//   var obj = this.toObject();
//   return obj;
// }
// module.exports = mongoose.model("ChildCategory", ChildSchema);
