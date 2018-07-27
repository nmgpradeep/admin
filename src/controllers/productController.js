const bodyParser = require('body-parser')
const Category = require('../models/category')
const Product = require('../models/product')
const ProductImage = require('../models/productImage')
const User = require('../models/User')
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
var gm = require('gm');

/** Auther	: Rajiv kumar
 *  Date	: June 18, 2018
 */
///function to save new product in the list
const create = (req, res) => {
  var form = new multiparty.Form();
  form.parse(req, function(err,data,files){
    console.log('message data', data)
    if(!data.productName){
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.REQUIRED_DATA
      })
    }
    const flag = validation.validate_all_request(data,['productName'])

    if(flag){
      return res.json(flag);
    }
      let now =new Date();
      Product.create(data, (err,result)=> {
        console.log('Res-Product',err, result);
        if(err) {
          return res.send({
            errr: err,
            code: httpResponseCode.BAD_REQUEST,
            message: httpResponseMessage.INTERNAL_SERVER_ERROR
          })
        } else {
          console.log('Created-Product', err, result);
          if((files.bannerImage) && files.bannerImage.length > 0 && files.bannerImage != '') {
            var fileName = files.bannerImage[0].originalFilename;
            var ext = path.extname(fileName);
            var newfilename = files.bannerImage[0].fieldName + '-' + Date.now() + ext;

            fs.readFile(files.bannerImage[0].path, function(err, fileData){
              if(err) {
                res.send(err);
                return;
              }
              fileName = files.bannerImage[0].originalFilename;
              ext = path.extname(fileName);
              newfilename = newfilename;
              pathNew = constant.product_path + newfilename;

              fs.writeFile(pathNew, fileData, function(err) {
                if (err) {
                  res.send(err);
                }
              });
              console.log('resultssssssssssss', result)
              var productImage = new ProductImage({
                productId : result._id,
                imageName:newfilename ,
                imageURL: 'assets/uploads/Products/'+newfilename
                
              })
                      
              productImage.save(function(error,images){
                console.log('your image has been stored');
                if(error){
                  console.log(error);
                }
              })
            });
          }
          
        result.bannerImage = newfilename;
              return res.send({
                code: httpResponseCode.EVERYTHING_IS_OK,
                message: httpResponseMessage.SUCCESSFULLY_DONE,
                result: result
              });
        }
      })
  })
  
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
		//products.populate('userId',['firstName','lastName']);
		//products.populate('productCategory',['categoryName']);	 
          Product.count().exec(function(err, count) {
            if (err) return next(err)      
               // products.forEach(function(product) {
                  //     ProductImage.find({productId:product._id},(err,resImage) =>{
                  //       if(err){
                  //           console.log('ERROR IMAGE')
                  //       }else{
                  //         console.log("ProductImage",resImage)                                                  
                  //       }

                  //     })
                  // });

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
	//console.log('<<<<<<<<<<<Product>>>>',id);  
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
