/*
	*TradeReturn Model
	*Author	: karnika sharma
	*Date	: October, 2018
*/
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var TradeReturnSchema = new Schema({
TradeId:{
	type: Schema.Types.ObjectId,
    ref: 'Trade'
},
UserId:{
	type: Schema.Types.ObjectId,
	ref: 'User'
},
ReturnOption:{
	type: String,
	ref: 0
},
Description:{
  type:String,
  trim: true,
  default:null
},
ProposedSolution:{
  type:String,
  trim:true,
  sparse:true,
  default:0
},
ResolvedMessages:{
  type:String,
  trim:true,
  sparse:true,
  default:0
},
ResolvedBy:{
  type:String,
  default:null
},
ResolvedDate:{
  type: Date, default: Date.now
},
status:{
  type:String,
  trim:true,
  sparse:true,
  default:0 
}
},
{
timestamps:true
});

TradeReturnSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
 }
module.exports = mongoose.model('TradeReturn', TradeReturnSchema);
