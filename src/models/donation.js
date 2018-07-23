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
userId:{
 type: Schema.Types.ObjectId,
 ref: 'User'
},
productCategory:{
 type: Schema.Types.ObjectId,
 ref: 'Category'
},
size:{
 type:String,
 trim: true
},
color:{
 type:String,
 trim:true,
},
brand:{
 type:String,
 trim:true
},
productAge:{
 type:String,
 trim:true
},
productStatus:{
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
      phone:{
        type:String,
        trim:true
      },
       email:{
        type:String,
        trim:true
       },
       country:{
         type:String,
         trim:true
       },
       location:{
        type:String,
        trim:true

       },
       house:{
        type:String,
         trim:true 
       },
       landmark:{
         type:String,
         trim:true

       },
       type:{
         type:String,
         trim:true

       },
       zipCode:{
         type:String,
         trim:true

       },
       town:{
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
