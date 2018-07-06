const bodyParser = require('body-parser')
const Donation = require('../models/donation')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const moment = require('moment-timezone');
const constant = require("../../common/constant");
const nodemailer = require('nodemailer');

/** Auther	: Rajiv kumar
 *  Date	: June 18, 2018
 */
///function to save new product in the list
const create = (req, res) => {
  console.log('<<<<<<<<<<<', JSON.stringify(req.body))
  if (!req.body.productName && !req.body.userId && !req.body.productCategory) {
    return res.send({
      code: httpResponseCode.BAD_REQUEST,
      message: httpResponseMessage.REQUIRED_DATA
    })
  }
  const data = req.body;
  const flag = validation.validate_all_request(data, ['productName', 'productCategory']);
  if (flag) {
    return res.json(flag);
  }
      let now = new Date();
    
      Donation.create(req.body, (err, result) => {
		  console.log('RES-PRODUCTS',err, result);
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

/** Auther	: Rajiv kumar
 *  Date	: June 22, 2018
 */
/// function to list all dinated products
const donations = (req, res) => { 
  //~ Donation.find({},(err,result)=>{
		//~ if (!result) {
			//~ res.json({
			  //~ message: httpResponseMessage.ITEM_NOT_FOUND,
			  //~ code: httpResponseMessage.BAD_REQUEST
			//~ });
		  //~ }else {				
			//~ return res.json({
				  //~ code: httpResponseCode.EVERYTHING_IS_OK,				
				  //~ result: result
				//~ });
		  //~ }
	  //~ })
	  
	var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    Donation.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, donation) {
          Donation.count().exec(function(err, count) {
            if (err) return next(err)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: donation,
                  total : count,
                  current: page,
                  perPage: perPage,
                  pages: Math.ceil(count / perPage)
              });
            })
        });
}


/** Auther	: Rajiv kumar
 *  Date	: June 22, 2018
 *	Description : Function to view the donated product details
**/
const viewDonation = (req, res) => {
	const id = req.params.id;
	console.log('<<<<<<<<<<<Product>>>>',id);  
	Donation.findById({_id:id}, (err, result) => {
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


/** Auther	: Rajiv kumar
 *  Date	: June 22, 2018
 *	Description : Function to update the donation
 **/
const updateDonation = (req, res) => { 
  Donation.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
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

/** Auther	: Rajiv kumar
 *  Date	: June 22, 2018
 *	Description : Function to delete the Donation
 **/
const deleteDonation = (req, res) => {	
	Donation.findByIdAndRemove(req.params.id, (err,result) => {
    if(err){
		return res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
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


/** Auther	: Rajiv Kumar
 *  Date	: June 22, 2018
 *	Description : Function to update the donation status.
 **/
const updateStatus = (req, res) => { 
  Donation.update({ _id:req.body.id },  { "$set": { "donationStatus": req.body.donationStatus } }, { new:true }, (err,result) => {
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
  create,
  donations,
  viewDonation,
  updateDonation,
  deleteDonation,
  updateStatus 
}
