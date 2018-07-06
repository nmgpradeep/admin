const bodyParser = require('body-parser')
const Testimonial = require('../models/testimonial')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');

/** Auther	: Saurabh Agarwal
 *  Date	: July 6, 2018
 **/
///function to save new Testimonial in the list
const createTestimonials = (req, res) => {
  console.log('<<<<<<<<<<<', JSON.stringify(req.body))
  if (!req.body.title) {
    return res.send({
      code: httpResponseCode.BAD_REQUEST,
      message: httpResponseMessage.REQUIRED_DATA
    })
  }
  const data = req.body;
  const flag = validation.validate_all_request(data, ['title']);
  if (flag) {
    return res.json(flag);
  }
      let now = new Date();
    
      Testimonial.create(req.body, (err, result) => {
		  console.log('RES-title',err, result);
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

/** Auther	: Saurabh Agarwal
 *  Date	: July 6, 2018
 */
/// function to list all Testimonials
const listTestimonials = (req, res) => { 
  Testimonial.find({},(err,result)=>{
		if (!result) {
			res.json({
			  message: httpResponseMessage.ITEM_NOT_FOUND,
			  code: httpResponseMessage.BAD_REQUEST
			});
		  }else {				
			return res.json({
				  code: httpResponseCode.EVERYTHING_IS_OK,				
				  result: result
				});
		  }
	  })
}


/** Auther	: Saurabh Agarwal
 *  Date	: July 6, 2018
**/
//Function to view the testimonials details
const viewTestimonials = (req, res) => {
	const id = req.params.id;
	console.log('<<<<<<<<<<<testimonials>>>>',id);  
	Testimonial.findById({_id:id}, (err, result) => {
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
 *  Date	: July 6, 2018
 **/
//Function to update the testimonial
const updateTestimonials = (req, res) => { 
  Testimonial.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
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
 *  Date	: July 6, 2018
 **/
//Function to delete the testimonials
const deleteTestimonials = (req, res) => {	
	Testimonial.findByIdAndRemove(req.params.id, (err,result) => {
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
 *  Date	: July 6, 2018
 **/
//Function to update the testimonials status.
const updateStatus = (req, res) => { 
	console.log("REQ0",req.body)
  Testimonial.update({ _id:req.body._id },  { "$set": { "status": req.body.status } }, { new:true }, (err,result) => {
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
  createTestimonials,
  listTestimonials,
  viewTestimonials,
  updateTestimonials,
  deleteTestimonials,
  updateStatus 
}
