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
	// type: Schema.Types.ObjectId, 
	// ref: 'NotificationType' 
},
fromUserId:{
	type: String,
	trim: true
},
toUserId: { 
type: String,
trim: true
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
