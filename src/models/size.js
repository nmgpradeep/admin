/* Size Model
    *Author : Saurabh Agarwal
    *Date   : July 12, 2018
*/
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var SizeSchema = new Schema ({
    size:{ 
        type:String,
        trim:true
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
},
{
    timestamps:true
    
});

SizeSchema.methods.toJSON = function() {
   var obj = this.toObject();   
   return obj;
}

module.exports = mongoose.model('Size', SizeSchema);
