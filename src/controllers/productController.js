const bodyParser = require('body-parser')
const Category = require('../models/category')
const Product = require('../models/product')
const TradePitchProduct = require('../models/tradePitchProduct')
const Trade = require('../models/trade')
const ProductImage = require('../models/productImage')
const User = require('../models/User')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
//const moment = require('moment-timezone');
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const constant  = require('../../common/constant')
const multiparty = require('multiparty');
const http = require('http');
const path = require('path');
const fs = require('fs'); //FileSystem for node.js
var gm = require('gm');

/** Auther	: Rajiv kumar
 *  Date	: June 18, 2018
 */
///function to save new product in the list
const create = (req, res) => {
  var form = new multiparty.Form();
  form.parse(req, function(err, data, files) {
	  //console.log('Multiple', err, fields, files);
	   //console.log('FIELD', fields.pageTitle[0]);
	  if (!data.productName) {
		return res.send({
		  code: httpResponseCode.BAD_REQUEST,
		  message: httpResponseMessage.REQUIRED_DATA
		})
	  }	  
	  const flag = validation.validate_all_request(data, ['productName']);
	  if (flag) {
		return res.json(flag);
	  }
		  let now = new Date();		
		  Product.create(data, (err, result) => {
			 // console.log('RES-Page',err, result);
			if (err) {
			  return res.send({
				errr : err,
				code: httpResponseCode.BAD_REQUEST,
				message: httpResponseMessage.INTERNAL_SERVER_ERROR
			  })
			} else {
			  console.log('Created-Page',err, result);
			 // check file and upload if exist 
			 if((files.productImages) && files.productImages.length > 0 && files.productImages != '') {
				var fileName = files.productImages[0].originalFilename;
				var ext = path.extname(fileName);
				var newfilename = files.productImages[0].fieldName + '-' + Date.now() + ext;
				fs.readFile(files.productImages[0].path, function(err, fileData) {
				  if (err) {
					res.send(err);
					return;
				  }
				  fileName = files.productImages[0].originalFilename;
				  ext = path.extname(fileName);
				  newfilename = newfilename;
				  pathNew = constant.product_path + newfilename;
				  //return res.json(process.cwd());
				  fs.writeFile(pathNew, fileData, function(err) {
					if (err) {
					  res.send(err);
					  return;
					}          

				  });
				});
			  }		
			  console.log('resultImgas',result);	 
			  Product.update({ _id:result._id },  { "$set": { "productImages": newfilename } }, { new:true }, (err,fileupdate) => {
				if(err){				
					return res.send({
						code: httpResponseCode.BAD_REQUEST,
						message: httpResponseMessage.FILE_UPLOAD_ERROR
					});
				} else {				    
					result.productImages = newfilename;
					return res.send({
						code: httpResponseCode.EVERYTHING_IS_OK,
						message: httpResponseMessage.SUCCESSFULLY_DONE,
						result: result
					})
				  }
			   })	  
			  ///end file update///	  
			}
		  })
    });  
}
  


/** Auther	: Rajiv kumar
 *  Date	: June 18, 2018
 */
/// function to list all products
const allProducts = (req, res) => {	
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;

    Product.aggregate([{
	  $lookup :{
		from: 'productimages', 
		localField: '_id',
		foreignField: 'productId',
		as: 'images'
	  }},
	  {
		$lookup: {
			from: "users",
			localField: "userId",
			foreignField: "_id",
			as: "user"
		}
	},{
		$lookup: {
			from: "categories",
			localField: "productCategory",
			foreignField: "_id",
			as: "category"
		}
	},{
		$lookup: {
			from: "sizes",
			localField: "size",
			foreignField: "_id",
			as: "size"
		}
	
	},{
		$lookup: {
			from: "brands",
			localField: "brand",
			foreignField: "_id",
			as: "brand"
		}
	}])
     .skip((perPage * page) - perPage)
     .limit(perPage)        
     .sort({createdAt:-1})   
     .exec(function(err, products) {			 
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
	Product.findById({_id:id})
		.populate('userId')
		.populate('userId',['firstName','lastName'])
		.populate('productCategory',['title'])
		.populate('brand',['brandName'])
		.populate('size',['size'])
	    .exec(function(err, result){
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
			} else {
			 return res.json({
				code: httpResponseCode.EVERYTHING_IS_OK,             
				result: result
			  });
			}
		}
	}); 
}


/** Auther	: KS
 *  Date	: August 29, 2018
 *	Description : Function to listing popular items
**/
const popularItems = (req,res) => {
	//console.log('ddddddddddd',todayDate);
}

/** Auther	: KS
 *  Date	: August 29, 2018
 *	Description : Function to listing popular items
**/
const switchTodays = (req,res) => {	
	var toDate = new Date();
	 Trade.find({createdAt:new Date("2018-07-17T13:16:22.095Z")})	
	    .populate({ path: "tradePitchProductId", model: "Product"})
	    .populate({ path: "tradeSwitchProductId", model: "Product"})
	    .populate({ path: "productCategory", model: "Category"})
	    .populate({ path: "productImages", model: "Product"})	   
	    .exec(function(err,result){			
			console.log('mmmmmm',result);
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
			} else {
			 return res.json({
				code: httpResponseCode.EVERYTHING_IS_OK,             
				result: result
			  });
			}
		 }
	 }); 
}


/** Auther	: Rajiv kumar
 *  Date	: June 21, 2018
 *	Description : Function to update the Product details.
 **/

const updateProduct = (req, res) => { 
  var form = new multiparty.Form();
	form.parse(req, function(err, data, files) {
	  console.log('FIELD',data);
	  if (!data.productName) {
		return res.send({
		  code: httpResponseCode.BAD_REQUEST,
		  message: httpResponseMessage.REQUIRED_DATA
		})
	  }	  
	  const flag = validation.validate_all_request(data, ['productName']);
	  if (flag) {
		return res.json(flag);
	  }
	 let now = new Date();	
     Product.findOneAndUpdate({ _id:data._id}, data, { new:true },(err,result) => {
     if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
     } else {
      if (!result) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      } else {
		 if ((files.productImages) && files.productImages.length > 0 && files.productImages != '') {
			var fileName = files.productImages[0].originalFilename;
			var ext = path.extname(fileName);
			var newfilename = files.productImages[0].fieldName + '-' + Date.now() + ext;
			fs.readFile(files.productImages[0].path, function(err, fileData) {
			  if (err) {
				res.send(err);
				return;
			  }
			  fileName = files.productImages[0].originalFilename;
			  ext = path.extname(fileName);
			  newfilename = newfilename;
			  pathNew = constant.product_path + newfilename;
			  fs.writeFile(pathNew, fileData, function(err) {
				if (err) {
				  res.send(err);
				  return;
				}
				  });
				}); 			  
			  Product.update({ _id:data._id },  { "$set": { "productImages": newfilename } }, { new:true }, (err,fileupdate) => {
				if(err){				
					return res.send({
						code: httpResponseCode.BAD_REQUEST,
						message: httpResponseMessage.FILE_UPLOAD_ERROR
					});
				} else {				    
					result.productImages = newfilename;
					return res.send({
						code: httpResponseCode.EVERYTHING_IS_OK,
						message: httpResponseMessage.SUCCESSFULLY_DONE,
						result: result
					});
				  }				  
				 
			   })				    
            }
            else {
			   return res.json({
				  code: httpResponseCode.EVERYTHING_IS_OK,
				  message: httpResponseMessage.SUCCESSFULLY_DONE,
				 result: result
               });	 	
			 }
           }    
        }
      }) 
   });
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
  allProducts,
  viewProduct,
  updateProduct,
  deleteProduct,
  changeStatus,
  popularItems,
  switchTodays 
}
