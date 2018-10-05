'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
  relationship = require("mongoose-relationship");

global.Promise = mongoose.Promise;
var  bcrypt = require('bcrypt-nodejs');
var WishListSchema = new Schema({
productId:{
 type:Schema.Types.ObjectId,
 ref:'Product'
},
userId:{
     type: Schema.Types.ObjectId,
     ref: 'User'
},
addedOn:{
     type : Date,
     default: Date.now
}
},
{
type : Date, default: Date.now
});

WishListSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
}
module.exports = mongoose.model('WishList', WishListSchema);
