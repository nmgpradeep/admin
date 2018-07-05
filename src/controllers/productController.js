const bodyParser = require('body-parser')
const Category = require('../models/category')
const Product = require('../models/product')
const User = require('../models/User')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const moment = require('moment-timezone');
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
  Product.findOne({ productName: req.body.productName,productCategory:req.body.productCategory }, (err, result) => {
	
    if (result) {

      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.ALL_READY_EXIST_EMAIL
      })
    } else {
      let now = new Date();
		
	 const user = User.findById(req.body.userId);
	  //~ req.body.userId = user;
	  //~ console.log(req.body); return;
    //~ const category = User.findById(req.body.productCategory);
	  //~ req.body.productCategory = category;
	  
      Product.create(req.body, (err, result) => {
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
  })
}

/** Auther	: Rajiv kumar
 *  Date	: June 18, 2018
 */
/// function to list all products
const products = (req, res) => { 
	const count = 0;
	const page = 0;
	const perPage = 0;
  Product.find({},(err,result)=>{
		if (!result) {
			res.json({
			  message: httpResponseMessage.ITEM_NOT_FOUND,
			  code: httpResponseMessage.BAD_REQUEST
			});
		  }else {				
			return res.json({
				 code: httpResponseCode.EVERYTHING_IS_OK,
				 message: httpResponseMessage.LISTED_SUCCESSFULLY,
				 result: result,
				 total : count,
                 current: page,
                 perPage: perPage,
                 pages: 0
				});
		  }
	  })
}


/** Auther	: Rajiv kumar
 *  Date	: June 21, 2018
 *	Description : Function to view the available product
**/
const viewProduct = (req, res) => {
	const id = req.params.id;
	console.log('<<<<<<<<<<<Product>>>>',id);  
	Product.findById({_id:id}, (err, result) => {
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
 *  Date	: June 21, 2018
 *	Description : Function to update the Product details.
 **/
const updateProduct = (req, res) => { 
  Product.findOneAndUpdate({ _id:req.body.id }, req.body, { new:true },(err,result) => {
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
 *  Date	: June 21, 2018
 *	Description : Function to delete the Product
 **/
const deleteProduct = (req, res) => {	
	Product.findByIdAndRemove(req.params.id, (err,result) => {
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


module.exports = {
  create,
  products,
  viewProduct,
  updateProduct,
  deleteProduct  
}
