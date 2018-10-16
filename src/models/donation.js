'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var DonationSchema = new Schema({
productName:{
 type:String,
 trim:true
},
description:{
 type:String,
 trim:true
},
// userId:{
//  type: Schema.Types.ObjectId,
//  ref: 'User'
// },
productCategory:{
 type: Schema.Types.ObjectId,
 ref: 'Category'
},
size:{
 type: Schema.Types.ObjectId,
 ref: 'Size'
},
color:{
 type:String,
 trim:true,
},
brand:{
 type: Schema.Types.ObjectId,
 ref: 'Brand'
},
productAge:{
 type:String,
 trim:true
},

//0=> Pending , 1 => Accepted , 2 =>Rejected
productStatus:{
 type:String,
 trim:true,
 sparse:true,
 default:0
},

//0 => Picked up , 1 =>Shipped , 2 => Delivered

shippingStatus:{
 type:String,
 trim:true,
 sparse:true,
 default:0
},

productImage:{
 type:String,
 trim:true,
 sparse:true,
 default:0
},

condition:{
 type:String,
 trim:true,
},
pickupAddress:[{
      name:{
       type:String,
       trim:true
      },
      contactNumber:{
        type:String,
        trim:true
      },
       email:{
        type:String,
        trim:true
       },
       city: null || {
       type:Schema.Types.ObjectId,
       ref: 'City'
       },
       state: null || {
       type:Schema.Types.ObjectId,
       ref: 'State'
       },
       country: null || {
       type:Schema.Types.ObjectId,
       ref:'Country'
       },
       address1:{
        type:String,
         trim:true
       },
       address2:{
         type:String,
         trim:true
       },
       landmark:{
         type:String,
         trim:true

       },
       zipCode:{
         type:String,
         trim:true

       }
    }]
},
{
timestamps:true
});

DonationSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
   }

module.exports = mongoose.model('Donation', DonationSchema);
