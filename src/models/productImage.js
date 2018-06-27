'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var ProductImageSchema = new Schema({
productId:{ 
   type: Schema.Types.ObjectId,
   ref: 'Product'
},
imageName:{
    type:String,
    trim:true
},
imageURL:{
 type:String,
 sparse: true 
},
imageStatus:{
 type:String,
 trim:true,
 sparse:true,
 default:1  
}
},
{
timestamps:true
});

ProductImageSchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
}

module.exports = mongoose.model('ProductImage', ProductImageSchema);
