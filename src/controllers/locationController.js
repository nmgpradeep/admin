const bodyParser = require('body-parser')
//const Category = require('../models/category')
const Country = require('../models/country')
//const ProductImage = require('../models/productImage')
//const User = require('../models/User')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const constant  = require('../../common/constant')

const multiparty = require('multiparty');
const http = require('http');
const path = require('path');
const fs = require('fs'); //FileSystem for node.js
var gm = require('gm'); //GraphicsMagick for node.js

/*
    *Author: Saurabh Agarwal
    *Date  : July 16, 2017
*/
//Function to save new country in the list
const createCountry = (req, res) => {
    console.log('<<<<<<<<<<<', JSON.stringify(req.body))
    if (!req.body.countryName) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.REQUIRED_DATA
      })
    }
    const data = req.body;
    const flag = validation.validate_all_request(data, ['countryName']);
    if (flag) {
      return res.json(flag);
    }
        let now = new Date();
      
        Country.create(req.body, (err, result) => {
            console.log('RES-countryName',err, result);
          if (err) {
            return res.send({
              errr : err,
              code: httpResponseCode.BAD_REQUEST,
              message: httpResponseMessage.INTERNAL_SERVER_ERROR
            })
          } else {
           
            return res.send({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.SUCCESSFULLY_DONE,
              result: result
            })
  
          }
        })
      
}
  
/*
    *Author: Saurabh Agarwal
    *Date  : July 16, 2017
*/
//Function to list all country
const listCountry = (req,res) => {
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    Country.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .populate('author')
      //.populate({path: "author", model :"User"})
      .exec(function (err, country){
          Country.count().exec(function(err, count) {
            if (err) return next(err)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: country ,
                  total : count,
                  current: page,
                  perPage: perPage,
                  pages: Math.ceil(count / perPage)
              });
            })
        });
}

  
/*
    *Author: Saurabh Agarwal
    *Date  : July 16, 2017
*/
//Function to view all country
const viewCountry = (req, res) => {
	const id = req.params.id;
	console.log('<<<<<<<<<<<Country>>>>',id);  
	Country.findById({_id:id}, (err, result) => {
    if (err) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.INTERNAL_SERVER_ERROR
      })
    } else {
      if (!result) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      }else {
        return res.json({
             code: httpResponseCode.EVERYTHING_IS_OK,             
             result: result
            });

      }
    }
  })
}


/** Auther	: Saurabh Agarwal
 *  Date	: July 16, 2018
 **/
//Function to update the Country
const updateCountry = (req, res) => { 
  Country.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
    if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
    }else {
      if (!result) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      }else {
        return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.SUCCESSFULLY_DONE,
             result: result
            });
      }
    }    
  })
}

/** Auther	: Saurabh Agarwal
 *  Date	: July 16, 2018
 **/
//Function to delete the Country
const deleteCountry = (req, res) => {	
	Country.findByIdAndRemove(req.params.id, (err,result) => {
    if(err){
		return res.json({
          message: httpResponseMessage.ITEM_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
    }
		return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.SUCCESSFULLY_DONE,
             result: result
            });
  })
}


/** Auther	: Saurabh Agarwal
 *  Date	: July 16, 2018
 **/
//Function to update the Country status.
const updateStatus = (req, res) => { 
	console.log("REQ0",req.body)
  Country.update({ _id:req.body._id },  { "$set": { "status": req.body.status } }, { new:true }, (err,result) => {
    if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
    }else {
      if (!result) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      }else {
        return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.CHANGE_STATUS_SUCCESSFULLY,
             result: result
            });
      }
    }    
  })
}


module.exports = {
  createCountry,
  listCountry,
  updateCountry,
  viewCountry,
  deleteCountry,
  updateStatus
}
