const bodyParser = require('body-parser')
const Size = require('../models/size')
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
// Function to save new size in the list

const createSizes = (req, res) => {
    console.log('<<<<<<<<<<<', JSON.stringify(req.body))
    if (!req.body.size) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.REQUIRED_DATA
      })
    }
    const data = req.body;
    const flag = validation.validate_all_request(data, ['size']);
    if (flag) {
      return res.json(flag);
    }
    let now = new Date();
      
    Size.create(req.body, (err, result) => {
        console.log('RES-Sizes',err, result);
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

const listingsize = (req, res) => {
    Size.find({}, (err, result) => {
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
// Function to list all Sizes
const listSizes = (req, res) => { 
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    Size.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .sort({createdAt:-1})
      .populate({path: "category", model: "Category"})
      .exec(function(err, size) {
          Size.count().exec(function(err, count) {
            if (err) return next(err)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: size ,
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
//Function to view the Size details
const viewSizes = (req, res) => {
	const id = req.params.id;
	console.log('<<<<<<<<<<<Sizes>>>>',id);  
	Size.findById({_id:id}, (err, result) => {
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
//Function to update the Sizes
const updateSizes = (req, res) => { 
    Size.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
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
  //Function to delete the Sizes
  const deleteSizes = (req, res) => {	
      Size.findByIdAndRemove(req.params.id, (err,result) => {
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
    createSizes,
    listSizes,
    updateSizes,
    viewSizes,
    deleteSizes,
    listingsize
}
