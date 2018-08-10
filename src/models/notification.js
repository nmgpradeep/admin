/* Notification Model
* Author    : Saurabh Agarwal
* Date  : July 27, 2018
*/
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var NotificationSchema = new Schema({
notificationTypeId:{ 
	type: String,
	trim: true	
},
fromUserId:{
	type: String,
	trim: true
},
toUserId: { 
type: String,
trim: true
},

isRead:{
	type:String,
	trim:true,
	default:0
}
},
{
timestamps:true
});

NotificationSchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
   }
module.exports = mongoose.model('Notification', NotificationSchema);
