const bodyParser = require('body-parser')
const Category = require('../models/category')
const Product = require('../models/product')
const User = require('../models/User')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const constant  = require('../../common/constant')


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
		
	 const product = Product.findById(req.body.productId);
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
const allProducts = (req, res) => {	
    var perPage = 1;//constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    Product.aggregate([{
	  $lookup :{
		from: 'productimages', 
		localField: '_id',
		foreignField: 'productId',
		as: 'images'
	  }}])
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, products) {
		  console.log('PROducts', products);		 
          Product.count().exec(function(err, count) {
            if (err) return next(err)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: products,
                  total : count,
                  current: page,
                  perPage: perPage,
                  pages: Math.ceil(count / perPage)
              });
            })
        });
    }

/** Auther	: KS
 *  Date	: JULY 9, 2018
 *	Description : Function to update the user status.
 **/
const changeStatus = (req, res) => {
  Product.update({ _id:req.body._id },  { "$set": { "productStatus": req.body.productStatus } }, { new:true }, (err,result) => {
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
  Product.findOneAndUpdate({ _id:req.body._id}, req.body, { new:true },(err,result) => {
    if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
    } else {
      if (!result) {
        res.json({
          message: httpResponseMessage.PRODUCT_NOT_FOUND,
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
	//console.log('<result>',req.params.id);
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
  allProducts,
  viewProduct,
  updateProduct,
  deleteProduct,
  changeStatus  
}
