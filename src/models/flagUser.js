/* Brand Model
    *Author : Rajiv Kumar
    *Date   : August 13, 2018
*/
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var flagUserSchema = new Schema ({
    message:{ 
        type:String,
        trim:true
    },
    flagFrom:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    flagTo:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    flagStatus:{
	 type:String,
	 trim:true,
	 sparse:true,
	 default:0   
	},
},
{
	timestamps:true
    
});

flagUserSchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
   }

module.exports = mongoose.model('FlagUser', flagUserSchema);
