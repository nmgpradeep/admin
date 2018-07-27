const bodyParser = require('body-parser')
const Brand = require('../models/brand')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const constant = require('../../common/constant')

/*
    *Author : Saurabh Agarwal
    *Date   : July 12, 2018
*/
// Function to save new Brand in the list

const createBrands = (req, res) => {   
	console.log("req",req.body)
    if (!req.body.brandName) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.REQUIRED_DATA
      })
    }
    const data = req.body;
    const flag = validation.validate_all_request(data, ['brandName']);
    if (flag) {
      return res.json(flag);
    }
    let now = new Date();
    Brand.create(req.body, (err, result) => {
        console.log('RES-brandName',err, result);
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

const listingbrand = (req, res) => {
    Brand.find({}, (err, result) => {
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
                message: httpResponseMessage.LOGIN_SUCCESSFULLY,
               result: result
              });
         }
      }
    });
}

/* 
    *Author : Saurabh Agarwal
    *Date   : July 12, 2018
*/
// Function to list all Brands
const listBrands = (req, res) => { 
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    Brand.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .sort({createdAt:-1})
      .populate({ path: "category", model: "Category"})
      .exec(function(err, brand) {
          Brand.count().exec(function(err, count) {
            if (err) return next(err)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: brand ,
                  total : count,
                  current: page,
                  perPage: perPage,
                  pages: Math.ceil(count / perPage)
              });
            })
        });
}


/** Auther	: Saurabh Agarwal
 *  Date	: July 12, 2018
**/
//Function to view the Brand details
const viewBrands = (req, res) => {
	const id = req.params.id;
	console.log('<<<<<<<<<<<Brands>>>>',id);  
	Brand.findById({_id:id}, (err, result) => {
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
 *  Date	: July 12, 2018
 **/
//Function to update the Brands
const updateBrands = (req, res) => { 
    Brand.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
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
  
  /**
    *Auther	: Saurabh Agarwal
    *Date	: July 12, 2018
   **/
  //Function to delete the Brands
  const deleteBrands = (req, res) => {	
      Brand.findByIdAndRemove(req.params.id, (err,result) => {
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



module.exports = {
    createBrands,
    listBrands,
    updateBrands,
    viewBrands,
    deleteBrands,
    listingbrand
}
