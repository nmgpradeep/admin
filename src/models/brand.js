/* Brand Model
    *Author : Saurabh Agarwal
    *Date   : July 12, 2018
*/
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var BrandSchema = new Schema ({
    brandName:{ 
        type:String,
        trim:true
    },
    category:{
           type:String,
           trim:true
    },
},
{
    timestamps:true
    
});

BrandSchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
   }

module.exports = mongoose.model('Brand', BrandSchema);
