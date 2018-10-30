const bodyParser = require('body-parser')
const Donation = require('../models/donation')
const Notification = require('../models/notification')
const User = require('../models/User')
const Category = require('../models/category')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const constant  = require('../../common/constant');
const multiparty = require('multiparty');
const http = require('http');
const path = require('path');
const fs = require('fs'); //FileSystem for node.js
const fsExtra = require('fs-extra');
var gm = require('gm'); //GraphicsMagick for node.js
const uuidv1 = require('uuid/v1'); // package  to get unique string or number

/** Auther	: Rajiv kumar
 *  Date	: June 18, 2018
 */
///function to save new product in the list
const create = (req, res) => {
  var form = new multiparty.Form();
  form.parse(req, function(err, data, files) {
	  //console.log('dddddddddddddddd',data);
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
		  Donation.create(data, (err, result) => {
			if (err) {
			  return res.send({
				errr : err,
				code: httpResponseCode.BAD_REQUEST,
				message: httpResponseMessage.INTERNAL_SERVER_ERROR
			  })
			} else {
			 // console.log('Created-Page',err, result);
			 if((files.productImage) && files.productImage.length > 0 && files.productImage != '') {
				var fileName = files.productImage[0].originalFilename;
				var ext = path.extname(fileName);
				var newfilename = files.productImage[0].fieldName + '-' + Date.now() + ext;
				fs.readFile(files.productImage[0].path, function(err, fileData) {
				  if (err) {
					res.send(err);
					return;
				  }
				  fileName = files.productImage[0].originalFilename;
				  ext = path.extname(fileName);
				  newfilename = newfilename;
				  pathNew = constant.donationimage_path + newfilename;
          if (!fs.existsSync(constant.donationimage_path,777)){
              fs.mkdirSync(constant.donationimage_path);
          }
				  fs.writeFile(pathNew, fileData, function(err) {
					if (err) {
					  res.send(err);
					  return;
					}
				  });

          // update the uploaded file name in database
          Donation.update({ _id:result._id },  { "$set": { "productImage": newfilename } }, { new:true }, (err,fileupdate) => {
  				if(err){
  					return res.send({
  						code: httpResponseCode.BAD_REQUEST,
  						message: httpResponseMessage.FILE_UPLOAD_ERROR
  					});
  				} else {
  					result.productImage = newfilename;
  					return res.send({
  						code: httpResponseCode.EVERYTHING_IS_OK,
  						message: httpResponseMessage.SUCCESSFULLY_DONE,
  						result: result
  					})
  				  }
  			   })
  			  ///end file update///

				});
			  }

			}
		  })
    });
}
/** Auther	: Rajiv kumar
 *  Date	: June 22, 2018
 */
/// function to list all dinated products
const donations = (req, res) => {
     var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;

    Donation.aggregate([{
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
	},
	{
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
          Donation.count().exec(function(err, count) {
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
/** Auther	: Rajiv kumar
 *  Date	: June 22, 2018
 */
/// function to list all dinated products
const getConstant = (req, res) => {
	resultAdd = constant.donation_conditions;
	return res.json({
		code: httpResponseCode.EVERYTHING_IS_OK,
		message: httpResponseMessage.SUCCESSFULLY_DONE,
		result: resultAdd
	});
}
/** Auther	: Rajiv kumar
 *  Date	: June 22, 2018
 */
/// function to list all dinated products
const getReturnOption = (req, res) => {
	resultAdd = constant.returnReason;
	console.log('resultAdd',resultAdd)
	return res.json({
		code: httpResponseCode.EVERYTHING_IS_OK,
		message: httpResponseMessage.SUCCESSFULLY_DONE,
		result: resultAdd
	});
}
/** Auther	: karnika sharma
 *  Date	: august 16, 2018
 */
/// function to list all dinated products
const getdonationStatus = (req, res) => {
	resultAdd = constant.donation_status;
	return res.json({
		code: httpResponseCode.EVERYTHING_IS_OK,
		message: httpResponseMessage.SUCCESSFULLY_DONE,
		result: resultAdd
	});
}
/** Auther	: Rajiv kumar
 *  Date	: June 22, 2018
 */
/// function to list all dinated products
const getdonationshippingStatus = (req, res) => {
	resultAdd = constant.shippingStatus;
	return res.json({
		code: httpResponseCode.EVERYTHING_IS_OK,
		message: httpResponseMessage.SUCCESSFULLY_DONE,
		result: resultAdd
	});
}


/** Auther	: Rajiv kumar
 *  Date	: June 22, 2018
 *	Description : Function to view the donated product details
**/
const viewDonation = (req, res) => {
	const id = req.params.id;
	Donation.findById({_id:id})
		.populate('userId')
		.populate('userId',['firstName','lastName'])
		.populate('productCategory',['title'])
		.populate({ path: "brand", model: "Brand"})
		.populate({ path: "size", model: "Size"})
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

/** Auther	: karnika sharma
 *  Date	: Augutst 16, 2018
 *	Description : Function to view the donated product details
**/
const viewuser = (req, res) => {
//	console.log('<<<<<<<<<<<Product>>>>',req.params.id);
	const id = req.params.id;
	User.findById({_id:id})
	  .exec(function(err, result){
		 //console.log('rrrrrr',result);
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
	});
}


const updateDonation = (req, res) => {
  var form = new multiparty.Form();
	form.parse(req, function(err, data, files) {
	  //console.log('FIELD',data);
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
     Donation.findOneAndUpdate({ _id:data._id}, data, { new:true },(err,result) => {
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
			 if ((files.productImage) && files.productImage.length > 0 && files.productImage != '') {
				var fileName = files.productImage[0].originalFilename;
				var ext = path.extname(fileName);
				var newfilename = files.productImage[0].fieldName + '-' + Date.now() + ext;
				fs.readFile(files.productImage[0].path, function(err, fileData) {
				  if (err) {
					res.send(err);
					return;
				  }
				  fileName = files.productImage[0].originalFilename;
				  ext = path.extname(fileName);
				  newfilename = newfilename;
				  pathNew = constant.donationimage_path + newfilename;
          if (!fs.existsSync(constant.donationimage_path,777)){
              fs.mkdirSync(constant.donationimage_path);
          }
				  //return res.json(process.cwd());
				  fs.writeFile(pathNew, fileData, function(err) {
					if (err) {
					  res.send(err);
					  return;
					}
				  });
				});
      			  //console.log('asdf',newfilename);
      			  Donation.update({ _id:data._id },  { "$set": { "productImage": newfilename } }, { new:true }, (err,fileupdate) => {
      				if(err){
                res.send(err);
                return;
      				} else {
      					result.productImage = newfilename;
      					// return res.send({
      					// 	code: httpResponseCode.EVERYTHING_IS_OK,
      					// 	message: httpResponseMessage.SUCCESSFULLY_DONE,
      					// 	result: result
      					// });
      				}
    			   })
            } else {
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


//~ const updateStatus = (req, res) => {
  //~ Donation.update({ _id:req.body._id },  { "$set": { "productStatus": req.body.productStatus } }, { new:true }, (err,result) => {
    //~ if(err){
		//~ return res.send({
			//~ code: httpResponseCode.BAD_REQUEST,
			//~ message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  //~ });
    //~ }else {
      //~ if (!result) {
        //~ res.json({
          //~ message: httpResponseMessage.USER_NOT_FOUND,
          //~ code: httpResponseMessage.BAD_REQUEST
        //~ });
      //~ }else {
        //~ return res.json({
              //~ code: httpResponseCode.EVERYTHING_IS_OK,
              //~ message: httpResponseMessage.CHANGE_STATUS_SUCCESSFULLY,
             //~ result: result
            //~ });
      //~ }
    //~ }
  //~ })
//~ }
/** Auther	: Rajiv Kumar
 *  Date	: June 22, 2018
 *	Description : Function to update the donation status.
 **/
const updateStatus = (req, res) => {
 var form = new multiparty.Form();
   form.parse(req, function(err, data, files) {
	   //console.log('fields value',data.field,data.value)
	   var update={};
		update[data.field[0]]=data.value[0];
		//console.log("update",update)
        Donation.update({ _id:data._id },  { "$set": update}, { new:true }, (err,result) => {
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
				  if(data.value ==2){
				   Donation.findById({_id:data._id}, (err, result) => {
				    var notification = new Notification({ notificationTypeId:1,fromUserId:1,toUserId:result.userId});
				     notification.save(function (err) {
						if(err){
							return res.json({
							  code: httpResponseCode.BAD_REQUEST,
							  message: httpResponseMessage.NOTIFICATION_ERROR
							});
						  }
						});
					  })

					  let transporter = nodemailer.createTransport({
						host: constant.SMTP_HOST,
						port: constant.SMTP_PORT,
						secure: false, // true for 465, false for other ports
						auth: {
							user: constant.SMTP_USERNAME, // generated ethereal user
							pass: constant.SMTP_PASSWORD // generated ethereal password
						}
					});

					host=req.get('host');

					let mailOptions = {
						from: constant.SMTP_FROM_EMAIL, // sender address
						to:'karnika.sharma.newmediaguru@gmail.com', // list of receivers
						subject: 'Donated product request has been cancelled.', // Subject line
						text: 'Hello Sir,', // plain text body
						html : "Admin has been rejected your donation request."
					};

					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
							return console.log(error);
						}
						console.log('Message sent: %s', info.messageId);
						//console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
					});
				}

				return res.json({
				code: httpResponseCode.EVERYTHING_IS_OK,
				message: httpResponseMessage.CHANGE_STATUS_SUCCESSFULLY,
				result: result
				});
			 }
		   }
	    })
    });
}


// ################### write front user realted function in this block ################

/** Auther	: Rajiv kumar
 *  Date	: Sept 28, 2018
 */
/// function to list all dinated products for front user
const donatedProducts = (req, res) => {
   var perPage = constant.PER_PAGE_RECORD
   var page = req.params.page || 1;
   var condObject = {};
   Donation.find(condObject)
        .populate({ path: "productCategory", model: "Category"})
        .populate({ path: "userId",populate:[{path:"city"},{path:"state"},{path:"country"}]})
        .populate({ path: "pickupAddress.city"})
        .populate({ path: "pickupAddress.state"})
        .populate({ path: "pickupAddress.country"})
     .skip((perPage * page) - perPage)
     .limit(perPage)
     .sort({createdAt:-1})
     .exec(function(err, products) {
          Donation.count().exec(function(err, count) {
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

/** Auther	: Rajiv kumar
 *  Date	: October 15, 2018
 */
/// function to save the donation item in the database from front;
const donateProduct = (req, res) => {
  var form = new multiparty.Form();
  form.parse(req, function(err, data, files) {
    //console.log('dddddddddddddddd',data);
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
      let pickupAddress = {}
      pickupAddress.name = (data.name)?data.name:''
      pickupAddress.email = (data.email)?data.email:''
      pickupAddress.contactNumber = (data.contactNumber)?data.contactNumber:''
      pickupAddress.address1 = (data.address1)?data.address1:''
      pickupAddress.address2 = (data.address2)?data.address2:''
      pickupAddress.city = (data.city)?data.city:''
      pickupAddress.state = (data.state)?data.state:''
      pickupAddress.country = (data.country)?data.country:null
      pickupAddress.zipCode = (data.zipCode)?data.zipCode:''
      data.pickupAddress = pickupAddress
      Donation.create(data, (err, result) => {
      if (err) {
        return res.send({
        errr : err,
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.INTERNAL_SERVER_ERROR
        })
      } else {
       // console.log('Created-Page',err, result);
       var productImages = JSON.parse(data.files);

       if((productImages) && productImages.length > 0) {
         var uidv1 = uuidv1()
       //	console.log("productImages",productImages[i].filename);
         fsExtra.move(constant.tepmUpload_path+productImages[0].filename, constant.donationimage_path + productImages[0].filename).then(uploadedfile =>{
           fs.rename(constant.product_path + productImages[0].filename,constant.donationimage_path +uidv1+productImages[0].filename)
           .then(renameFile =>{
                   fs.remove(constant.donationimage_path + productImages[0].filename, err => {
                     if (err) return console.error(err)
                     console.log('success!')
                   });
             })
         });
        // update the uploaded file name in database
          Donation.update({ _id:result._id },  { "$set": { "productImage": productImages[0].filename } }, { new:true }, (err,fileupdate) => {
          if(err){
            return res.send({
              code: httpResponseCode.BAD_REQUEST,
              message: httpResponseMessage.FILE_UPLOAD_ERROR
            });
          } else {
              return res.send({
                code: httpResponseCode.EVERYTHING_IS_OK,
                message: httpResponseMessage.SUCCESSFULLY_DONE,
                result: result
              })
            }
           })
          ///end file update///

        }else{
          return res.send({
            code: httpResponseCode.EVERYTHING_IS_OK,
            message: httpResponseMessage.SUCCESSFULLY_DONE,
            result: result
          })

        }
      }
      })
    });
}



module.exports = {
  create,
  donations,
  viewDonation,
  updateDonation,
  deleteDonation,
  updateStatus,
  getConstant,
  getdonationStatus,
  getdonationshippingStatus,
  viewuser,
  donatedProducts,
  donateProduct,
  getReturnOption
}
