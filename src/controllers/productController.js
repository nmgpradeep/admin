const bodyParser = require('body-parser');
const Category = require('../models/category');
const Product = require('../models/product');
const WishList = require('../models/wishList');
const TradePitchProduct = require('../models/tradePitchProduct');
const Trade = require('../models/trade');
const OfferTrade = require('../models/offerTrade');
const ProductImage = require('../models/productImage');
const UserTradeRating = require('../models/userTradeRating');
const User = require('../models/User');
const Size = require('../models/size');
const Brand = require('../models/brand');
const httpResponseCode = require('../helpers/httpResponseCode');
const httpResponseMessage = require('../helpers/httpResponseMessage');
const validation = require('../middlewares/validation');
//const moment = require('moment-timezone');
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const constant = require('../../common/constant')
const multiparty = require('multiparty');
const http = require('http');
const path = require('path');
const fs = require('fs'); //FileSystem for node.js
const fsExtra = require('fs-extra');
var gm = require('gm');
var settings = require('../config/settings'); // get settings file
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const uuidv1 = require('uuid/v1'); // package  to get unique string or number
var ObjectId = require('mongodb').ObjectID;
//var Location = require('../middlewares/location');
var async = require('async');



getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length) {
            return parted[0];
        } else {
            return null;
        }
    } else {
        return null;
    }
};





/*function getUser (latitude,longitude,distance ,callback) {
 
 var responseData=[];
 
 var query = User.find({'loc': {
 $nearSphere: [
 latitude,
 longitude
 ],
 $maxDistance: distance
 
 }
 // branchId is the array [108,109,110]
 }, {_id: 1});
 
 
 return query.exec(function (err, challenge) {
 if (err) {
 return responseData;
 
 }
 
 if (!challenge) {
 return responseData;
 } else {
 
 
 // console.log(challenge);
 if (challenge.length) {
 
 Object.keys(challenge).forEach(function (key) {
 
 responseData[key] = {};
 responseData[key] = ObjectId(challenge[key]._id);
 
 
 });
 
 
 return callback(responseData);
 }
 
 //;
 
 }
 
 });
 
 
 
 
 
 
 
 
 
 }*/


/** Auther	: Rajiv kumar
 *  Date	: June 18, 2018
 */
///function to save new product in the list
const create = (req, res) => {
    var form = new multiparty.Form();
    form.parse(req, function (err, data, files) {
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
            if (err) {
                return res.send({
                    errr: err,
                    code: httpResponseCode.BAD_REQUEST,
                    message: httpResponseMessage.INTERNAL_SERVER_ERROR
                })
            } else {
                if ((files.productImages) && files.productImages.length > 0 && files.productImages != '') {
                    var fileName = files.productImages[0].originalFilename;
                    var ext = path.extname(fileName);
                    var newfilename = files.productImages[0].fieldName + '-' + Date.now() + ext;
                    fs.readFile(files.productImages[0].path, function (err, fileData) {
                        if (err) {
                            res.send(err);
                            return;
                        }
                        fileName = files.productImages[0].originalFilename;
                        ext = path.extname(fileName);
                        newfilename = newfilename;
                        pathNew = constant.product_path + newfilename;
                        //return res.json(process.cwd());
                        fs.writeFile(pathNew, fileData, function (err) {
                            if (err) {
                                res.send(err);
                                return;
                            }

                        });
                    });
                }
                Product.update({_id: result._id}, {"$set": {"productImages": newfilename}}, {new : true}, (err, fileupdate) => {
                    if (err) {
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
            }
        });

    });

}


/** Auther	: Rajiv kumar
 *  Date	: Sept 7, 2018
 */
///function to save new product in the list by front user
const addProduct = (req, res) => {
    var token = getToken(req.headers);
    if (token) {
        decoded = jwt.verify(token, settings.secret);
        var userId = decoded._id;
        var form = new multiparty.Form();
        form.parse(req, function (err, data, files) {
            // console.log('postdata', data);
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
            data.userId = userId;
            let now = new Date();
            Product.create(data, (err, result) => {
                if (err) {
                    return res.send({
                        errr: err,
                        code: httpResponseCode.BAD_REQUEST,
                        message: httpResponseMessage.INTERNAL_SERVER_ERROR
                    })
                } else {
                    var uploadedFiles = [];
                    if (data.files != '') {
                        var productImages = JSON.parse(data.files);
                        //console.log('productImages', productImages,productImages['filename']);
                        for (var i = 0; i < productImages.length; i++) {
                            var uidv1 = uuidv1()
                            //	console.log("productImages",productImages[i].filename);
                            fsExtra.move(constant.tepmUpload_path + productImages[i].filename, constant.product_path + productImages[i].filename).then(uploadedfile => {
                                fs.rename(constant.product_path + productImages[i].filename, constant.product_path + uidv1 + productImages[i].filename)
                                        .then(renameFile => {
                                            fs.remove(constant.product_path + productImages[i], err => {
                                                if (err)
                                                    return console.error(err)
                                                console.log('success!')
                                            });

                                        })
                            });
                            uploadedFiles.push({
                                productId: result._id,
                                imageName: productImages[i].filename,
                                imageStatus: 1,
                                imageURL: constant.product_path + productImages[i].filename
                            });
                        }
                        try {
                            ProductImage.insertMany(uploadedFiles);
                        } catch (e) {
                            res.send(e);
                            return;
                        }
                        Product.update({_id: result._id}, {"$set": {"productImages": productImages[0].filename}}, {new : true}).then(pimage => {

                            console.log("pimage", pimage)
                        })

                    }
                    //console.log('Created-Page',err, result);
                    // check file and upload if exist
                    if ((files.productImages) && files.productImages.length > 0 && files.productImages != '') {
                        var fileName = files.productImages[0].originalFilename;
                        var ext = path.extname(fileName);
                        var newfilename = files.productImages[0].fieldName + '-' + Date.now() + ext;
                        fs.readFile(files.productImages[0].path, function (err, fileData) {
                            if (err) {
                                res.send(err);
                                return;
                            }
                            fileName = files.productImages[0].originalFilename;
                            ext = path.extname(fileName);
                            newfilename = newfilename;
                            pathNew = constant.product_path + newfilename;
                            //return res.json(process.cwd());
                            fs.writeFile(pathNew, fileData, function (err) {
                                if (err) {
                                    res.send(err);
                                    return;
                                }

                            });
                        });
                    }
                    //console.log('resultImgas',result);
                    Product.update({_id: result._id}, {"$set": {"productImages": newfilename}}, {new : true}, (err, fileupdate) => {
                        if (err) {
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
    } else {
        return res.status(403).send({code: 403, message: 'Unauthorized.'});
    }

}

/** Auther	: Rajiv kumar
 *  Date	: June 18, 2018
 */
/// function to list all products
const allProducts = (req, res) => {
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;

    Product.aggregate([{
            $lookup: {
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
        }, {
            $lookup: {
                from: "categories",
                localField: "productCategory",
                foreignField: "_id",
                as: "category"
            }
        }, {
            $lookup: {
                from: "sizes",
                localField: "size",
                foreignField: "_id",
                as: "size"
            }

        }, {
            $lookup: {
                from: "brands",
                localField: "brand",
                foreignField: "_id",
                as: "brand"
            }
        }])
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({createdAt: -1})
            .exec(function (err, products) {
                Product.count().exec(function (err, count) {
                    if (err)
                        return next(err)
                    return res.json({
                        code: httpResponseCode.EVERYTHING_IS_OK,
                        message: httpResponseMessage.SUCCESSFULLY_DONE,
                        result: products,
                        total: count,
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
    Product.update({_id: req.body._id}, {"$set": {"productStatus": req.body.productStatus}}, {new : true}, (err, result) => {
        if (err) {
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
    Product.findById({_id: id})
            .populate('userId')
            .populate('userId', ['firstName', 'lastName', 'profilePic'])
            .populate('productCategory', ['title'])
            .populate('brand', ['brandName'])
            .populate('size', ['size'])
            .exec(function (err, result) {
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


const activeProducts = (req, res) => {
    Product.find({productStatus: '1'})
            .populate('productCategory', ['title'])
            .exec(function (err, result) {
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

const filterBycategory = (req,res) => {
	  var form = new multiparty.Form();
    var conditionObject = {};
	  form.parse(req, function(err, data, files) {
      console.log('filterBycategory', data)
      if(data.category_type){
        conditionObject[data.category_type] = {$in: data.category_ids[0].split(',')};
      }
      if(data.brand_type){
        conditionObject[data.brand_type] = {$in: data.brand_ids[0].split(',')};
      }
      if(data.size_type){
        conditionObject[data.size_type] = {$in: data.size_ids[0].split(',')};
      }
      if(data.user_type){
        conditionObject[data.user_type] = {$in: data.user_ids[0].split(',')};
      }
      if(data.condition_type){
        conditionObject[data.condition_type] = {$in: data.condition_ids[0].split(',')};
      }

      if(data.color_type){
        conditionObject[data.color_type] = {$in: data.color_ids[0].split(',')};
      }
      if(data.age_type){
        conditionObject[data.age_type] = {$in: data.age_ids[0].split(',')};
      }

      if(data.location_type){
        var location = data.location_ids[0].split(',');
        //conditionObject[data.location_type] = {$in: };
        if (data.latitude && data.latitude[0].replace(" ", "").length) {
          var latitude = data.latitude[0].replace(" ", "");
          var longitude = data.longitude[0].replace(" ", "");
          const maxDistance = location[1] / 6371;
          const minDistance = location[0] / 6371;
          var query = User.find({'loc': {
              $nearSphere: [
                latitude,
                longitude
              ],
              $minDistance: minDistance,
              $maxDistance: maxDistance
            }
          }, {_id: 1}).exec(function(err, result){
            if(err){

            }else{
              console.log('MAX Distance User', result)
              if(result.length){
                conditionObject["userId"] = {$in: result};
              }
            }
          });
        }
      }
      if(data.rating_type){
        //data.rating_ids

        // var ratings = data.rating_ids[0].split(',');
        // var ratingsArray = [];
        // ratings.map(r => {
        //   ratingsArray.push(parseInt(r));
        // });
        // console.log('URRR', ratingsArray)
        // UserTradeRating.aggregate([{
        //   $unwind: '$userId'
        // }, {
        // $group: {
        //   _id: '$userId',
        //   totalRating:{ $avg: { $divide: [ "$review", 10 ] } },
        //   //ceilingValue: { $ceil: "$totalRating" },
        // //  $match: { ceilingValue: { $in: ratingsArray} },
        //   count: { $sum: 1 }
        // },
        // $project: {
        //   _id: 1,
        //   totalRating: 1,
        //   ceilingValue: {$ceil: "$totalRating" }
        // }
        // }])
        // .exec(function(err, transactions) {
        //   console.log('UserTradeRating r', transactions);
        // });
      }
      //console.log('conditionObject', conditionObject)
	   Product.find(conditionObject)
     .populate('productCategory',['title'])
     .populate({path:'userId',model:'User', select: 'firstName lastName profilePic' })
     .populate({path:'brand',model:'Brand'})
     .populate({path:'size',model:'Size'})
	  .exec(function(err, result){
      console.log('RESULT', result, err)
      if(err){
    		return res.send({
    			code: httpResponseCode.BAD_REQUEST,
    			message: httpResponseMessage.INTERNAL_SERVER_ERROR,
    			err:err
    		  });
     } else {
      if (result === undefined) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      }
       else {
		   return res.json({
			  code: httpResponseCode.EVERYTHING_IS_OK,
			  message: httpResponseMessage.SUCCESSFULLY_DONE,
			 result: result
		   });
		 }
        }
        //console.log('r',result);
      })
	});

//~ 
//~ 
	  //~ const typeData = data.type[0];
	  //~ const catIds = data.ids[0];
    //~ if(catIds != null){
  	  //~ if(catIds.indexOf(",") > -1){
  			 //~ catID = catIds.split(',');
  	  //~ } else {
  			 //~ catID = catIds;
  	  //~ }
  	  //~ var typeObject = {};
  	  //~ typeObject[typeData] = catID;
    //~ }else{
      //~ typeObject[typeData] = [];
      //~ data = {};
    //~ }
	   //~ Product.find(typeObject, data)
                //~ .populate('productCategory', ['title'])
                //~ .populate({path: 'userId', model: 'User'})
                //~ .populate({path: 'brand', model: 'brandName'})
                //~ .populate({path: 'size', model: 'size'})
                //~ .exec(function (err, result) {
                    //~ if (err) {
                        //~ return res.send({
                            //~ code: httpResponseCode.BAD_REQUEST,
                            //~ message: httpResponseMessage.INTERNAL_SERVER_ERROR,
                            //~ err: err
                        //~ });
                    //~ } else {
                        //~ if (!result) {
                            //~ res.json({
                                //~ message: httpResponseMessage.USER_NOT_FOUND,
                                //~ code: httpResponseMessage.BAD_REQUEST
                            //~ });
                        //~ } else {
                            //~ return res.json({
                                //~ code: httpResponseCode.EVERYTHING_IS_OK,
                                //~ message: httpResponseMessage.SUCCESSFULLY_DONE,
                                //~ result: result
                            //~ });
                        //~ }
                    //~ }
                    //~ //console.log('r',result);
                //~ })
    //~ })

}



/** Auther	: Rajiv Kumar
 *  Date	: September 19, 2018
 *	Description : Function to listing popular items
 **/
const popularItems = (req, res) => {
    //console.log()
    OfferTrade.aggregate([{
            $unwind: '$SwitchUserProductId'
        }, {
            $group: {
                _id: '$SwitchUserProductId',
                count: {$sum: 1},
                SwitchUserProductId: {$push: "$SwitchUserProductId"},
                SwitchUserId: {$push: "$SwitchUserId"},
                pitchUserId: {$push: "$pitchUserId"},
                ditchCount: {$push: "$ditchCount"}
            }
        }])
            .exec(function (err, popularItems) {
                //console.log("popularItems",popularItems.length)
                OfferTrade.populate(popularItems, {path: '_id', model: 'Product', populate: [{
                            path: 'productCategory', model: 'Category'}, {path: 'userId', model: 'User', select: 'firstName lastName userName profilePic'
                        }]}, function (err, populatedItem) {
                    //console.log("populatedItem",populatedItem);
                    return res.send({
                        code: httpResponseCode.EVERYTHING_IS_OK,
                        message: httpResponseMessage.SUCCESSFULLY_DONE,
                        result: populatedItem
                    })
                });
            });

}

/** Auther	: KS
 *  Date	: August 29, 2018
 *	Description : Function to listing popular items
 **/
const switchTodays = (req, res) => {
    var toDate = new Date();
    var startDate = moment(toDate).format('YYYY-MM-DD')
    var endDate = startDate + 'T23:59:59.495Z';
    var startDate = startDate + 'T00:00:01.495Z';
    //Trade.find({ switchDate: { '$gte':startDate, '$lte': endDate }})
    Trade.find({})
            .populate({path: "tradePitchProductId", populate: {path: "productCategory"}})
            .populate({path: "tradeSwitchProductId", model: "Product", populate: {path: "productCategory"}})
            .populate({path: "productImages", model: "Product"})
            .populate({path: "offerTradeId", populate: (["pitchUserId", "SwitchUserId"]), model: "offerTrade"})
            .exec(function (err, result) {
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
const checkExists = (req, res) => {
    var form = new multiparty.Form();
    form.parse(req, function (err, data, files) {
        const dataTrade = {};
        var pitchUserID = data.pitchUserID;
        var productId = data.productId;
        console.log('pitchUserID', productId);
        //Product.find({productCategory:id,userId:userId})
        //OfferTrade.find({pitchUserID:pitchUserID})
        OfferTrade.find({pitchUserId: pitchUserID, SwitchUserProductId: productId})
                .exec(function (err, result) {
                    if (err) {
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
    });
}



/** Auther	: Rajiv kumar
 *  Date	: June 21, 2018
 *	Description : Function to update the Product details.
 **/

const updateProduct = (req, res) => {
    var form = new multiparty.Form();
    form.parse(req, function (err, data, files) {
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
        Product.findOneAndUpdate({_id: data._id}, data, {new : true}, (err, result) => {
            if (err) {
                return res.send({
                    code: httpResponseCode.BAD_REQUEST,
                    message: httpResponseMessage.INTERNAL_SERVER_ERROR,
                    err: err
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
                        fs.readFile(files.productImages[0].path, function (err, fileData) {
                            if (err) {
                                res.send(err);
                                return;
                            }
                            fileName = files.productImages[0].originalFilename;
                            ext = path.extname(fileName);
                            newfilename = newfilename;
                            pathNew = constant.product_path + newfilename;
                            fs.writeFile(pathNew, fileData, function (err) {
                                if (err) {
                                    res.send(err);
                                    return;
                                }
                            });
                        });
                        Product.update({_id: data._id}, {"$set": {"productImages": newfilename}}, {new : true}, (err, fileupdate) => {
                            if (err) {
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
 *  Date	: June 21, 2018
 *	Description : Function to delete the Product
 **/
const deleteProduct = (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, result) => {
        if (err) {
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

/** Auther	: KS
 *  Date	: september 13, 2018
 *	Description : Function to search product listing
 **/
const searchresult = (req, res) => {

	 const id = req.params.id;
	if (req.params.latitude && req.params.latitude.trim().length) {
    var latitude = req.params.latitude;
  	var longitude = req.params.longitude;
  	const distance = 100 / 6371;
  	if (latitude && latitude.trim().length) {
  		latitude = req.params.latitude;
  		longitude =req.params.longitude;
  	}
		var query = User.find({'loc': {
				$nearSphere: [
					latitude,
					longitude
				],
				$maxDistance: distance
			}
			// branchId is the array [108,109,110]
		}, {_id: 1});
	}
	else{
	   var query = User.find({});
	}
    query.exec(function (err, challenge) {
        if (err) {
            console.log("error" + err);
        }
        
        if (!challenge) {
            console.log('Cant www: Found city:' + challenge)
        } else {

				var responseData = [];

				if (challenge.length) {
					Object.keys(challenge).forEach(function (key) {
						responseData[key] = {};
						responseData[key] = ObjectId(challenge[key]._id);

					});
				}
				if (id && id.trim().length && latitude && latitude.trim().length){
					var searchvalue = {productCategory:ObjectId(id),productStatus:"1",userId: {$in: responseData}};
				}

				else if((!(id) || id.trim().length ==0) && latitude && latitude.trim().length){
					var searchvalue = {productStatus:"1",userId: {$in: responseData}};
				}
				else if(id && id.trim().length){

					var searchvalue = {productCategory:ObjectId(id),productStatus:"1",userId: {$in: responseData}};
				}else{
					console.log("OUTTTT");
					var searchvalue = {};
				}
        Product.aggregate([
              {$match: searchvalue},
              {
//~ 
            //~ var responseData = [];
//~ 
            //~ if (challenge.length) {
                //~ Object.keys(challenge).forEach(function (key) {
                    //~ responseData[key] = {};
                    //~ responseData[key] = ObjectId(challenge[key]._id);
//~ 
                //~ });
            //~ }
            //~ if (id && id.trim().length && latitude && latitude.trim().length) {
                //~ var searchvalue = {productCategory: ObjectId(id), productStatus: "1", userId: {$in: responseData}};
            //~ } else if ((!(id) || id.trim().length == 0) && latitude && latitude.trim().length) {
                //~ var searchvalue = {productStatus: "1", userId: {$in: responseData}};
            //~ } else if (id && id.trim().length) {
//~ 
                //~ var searchvalue = {productCategory: ObjectId(id), productStatus: "1", userId: {$in: responseData}};
            //~ } else {
                //~ console.log("OUTTTT");
                //~ var searchvalue = {};
            //~ }
//~ 
//~ 
            //~ Product.aggregate([
//~ 
                //~ {$match: searchvalue},
//~ 
                //~ {
					//~ 
					
                    $lookup: {
                        from: "categories",
                        localField: "productCategory",
                        foreignField: "_id",
                        as: "productCategory"

                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userId"
                    }
                },
                {$unwind: '$userId'},
                {
                "$project": {
                  "_id": 1,
                  "productImages": 1,
                  "productStatus": 1,
                  "productName": 1,
                  "size": 1,
                  "color": 1,
                  "brand": 1,
                  "productAge": 1,
                  "condition": 1,
                  "productCategory.title": 1,
                  "userId.firstName": 1,
                  "userId.lastName": 1,
                  "userId.profilePic": 1
                }
              }
            ], function (err, result) {

                Product.count().exec(function (err, count) {
                    if (err) {
                        console.log("ewrewr" + err)
                        return next(err)
                    } else {
                        console.log("value" + result)
                        return res.json({
                            code: httpResponseCode.EVERYTHING_IS_OK,
                            message: httpResponseMessage.SUCCESSFULLY_DONE,
                            result: result,

                            //pages: Math.ceil(count / perPage)
                        });
                    }
                })


            }


            );


        }

    });

}

/** Auther	: KS
 *  Date	: september 13, 2018
 *	Description : Function to search product listing
 **/
const productDetails = (req, res) => {
    const id = req.params.id;
    Product.findById({_id: id})
            .populate({path: "productCategory", model: "Category"})
            .populate({path: "userId", model: "User"})
            .populate({path: 'size', model: 'Size'})
            .populate({path: 'brand', model: 'Brand'})
            .exec(function (err, result) {
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
                        var token = getToken(req.headers);
                        if (token.length > 10) {
                            console.log('token', token.length);
                            decoded = jwt.verify(token, settings.secret);
                            var userId = decoded._id;
                            Promise.all([
                                WishList.find({userId: userId, productId: id}),
                                OfferTrade.find({pitchUserId: userId, SwitchUserProductId: id})
                            ]).then((values) => {
                                return res.json({
                                    code: httpResponseCode.EVERYTHING_IS_OK,
                                    result: result,
                                    pitchProduct: (values[1].length > 0) ? true : false,
                                    wishListProduct: (values[0].length > 0) ? true : false
                                });
                            })
                        } else {
                            return res.json({
                                code: httpResponseCode.EVERYTHING_IS_OK,
                                result: result,
                                pitchProduct: false,
                                wishListProduct: false
                            });
                        }
                    }
                }
            });
}
/** Auther	: KS
 *  Date	: september 13, 2018
 *	Description : Function to search product listing
 **/
const productImages = (req, res) => {
    const id = mongoose.mongo.ObjectId(req.params.id);
    ProductImage.find({productId: id})
            .exec(function (err, result) {
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
 *  Date	: August 6, 2018
 *	Description : Function to get myTreasureChest for front-user
 **/
const myTreasureChest = (req, res) => {
    var perPage = constant.PER_PAGE_RECORD;
    var page = req.params.page || 1;
    var token = getToken(req.headers);
    if (token) {
        decoded = jwt.verify(token, settings.secret);
        var userId = decoded._id;
        Product.find({userId: userId})
                .populate({path: "productCategory", model: "Category"})
                .populate({path: "userId", model: "User"})
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .sort({createdAt: -1})
                .exec(function (err, products) {
                    if (err) {
                        return res.send({
                            code: httpResponseCode.BAD_REQUEST,
                            message: httpResponseMessage.INTERNAL_SERVER_ERROR
                        })
                    } else {
                        if (!products) {
                            res.json({
                                message: httpResponseMessage.USER_NOT_FOUND,
                                code: httpResponseMessage.BAD_REQUEST
                            });
                        } else {
                            return res.json({
                                code: httpResponseCode.EVERYTHING_IS_OK,
                                message: httpResponseMessage.LOGIN_SUCCESSFULLY,
                                result: products
                            });

                        }
                    }
                });
    } else {
        return res.status(403).send({code: 403, message: 'Unauthorized.'});
    }
}
/** Auther	: KS
 *  Date	: August 6, 2018
 *	Description : Function to get myTreasureChest for front-user
 **/
const relatedCategoryProduct = (req, res) => {
    const id = req.params.id;
    Product.findById({_id: id})
            .populate({path: "productCategory", model: "Category"})
            .populate({path: "userId", model: "User"})
            .exec(function (err, products) {
                if (products.productCategory) {
                    const categoryID = products.productCategory._id;
                    //console.log('categoryID',categoryID)
                    Product.find({productCategory: categoryID})
                            .populate({path: "productCategory", model: "Category"})
                            .populate({path: "userId", model: "User"})
                            .exec(function (err, items) {
                                if (err) {
                                    return res.send({
                                        code: httpResponseCode.BAD_REQUEST,
                                        message: httpResponseMessage.INTERNAL_SERVER_ERROR
                                    })
                                } else {
                                    if (!items) {
                                        res.json({
                                            message: httpResponseMessage.USER_NOT_FOUND,
                                            code: httpResponseMessage.BAD_REQUEST
                                        });
                                    } else {
                                        return res.json({
                                            code: httpResponseCode.EVERYTHING_IS_OK,
                                            result: items
                                        });
                                    }
                                }
                            });
                }
            });
}

/** Auther	: Rajiv kumar
 *  Date	: August 6, 2018
 *	Description : Function to get myTreasureChest for front-user
 **/
const myTreasureChestFilterBy = (req, res) => {
    var sortObject = {};
    var condObject = {};
    var stype = "productName";
    var sdir = 1;
    if (req.body.sortBy != "" || req.body.sortBy != undefined) {
        if (req.body.sortBy == 1) {
            var stype = "createdAt";
            var sdir = 1;
        } else if (req.body.sortBy == 2) {
            var stype = "productName";
            var sdir = -1;
        } else if (req.body.sortBy == 3) {
            var stype = "productName";
            var sdir = 1;
        } else if (req.body.sortBy == 4) {
            var stype = "createdAt";
            var sdir = -1;
        }
    }
    sortObject[stype] = sdir;
    //console.log("Request Data",req.body)
    var perPage = constant.PER_PAGE_RECORD;
    var page = req.params.page || 1;

    var token = getToken(req.headers);
    if (token) {
        decoded = jwt.verify(token, settings.secret);
        var userId = decoded._id;
        condObject["userId"] = userId;
        if (req.body.category !== '') {
            condObject["productCategory"] = req.body.category;
        }

        Product.find(condObject)
                .populate({path: "productCategory", model: "Category"})
                .populate({path: "userId", model: "User"})
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .sort(sortObject)
                .exec(function (err, products) {
                    if (err) {
                        return res.send({
                            code: httpResponseCode.BAD_REQUEST,
                            message: httpResponseMessage.INTERNAL_SERVER_ERROR
                        })
                    } else {
                        if (!products) {
                            res.json({
                                message: httpResponseMessage.USER_NOT_FOUND,
                                code: httpResponseMessage.BAD_REQUEST
                            });
                        } else {
                            return res.json({
                                code: httpResponseCode.EVERYTHING_IS_OK,
                                message: httpResponseMessage.LOGIN_SUCCESSFULLY,
                                result: products
                            });
                        }
                    }
                });
    } else {
        return res.status(403).send({code: 403, message: 'Unauthorized.'});
    }
}


/** Auther	: Rajiv kumar
 *  Date	: October 26, 2018
 *	Description : Function to get tradeMatch for front-user
 **/
const tradeMatch = (req, res) => {
    var perPage = constant.PER_PAGE_RECORD;
    var page = req.params.page || 1;
    var token = getToken(req.headers);
    if (token) {
        decoded = jwt.verify(token, settings.secret);
        var userId = decoded._id;
        Product.find({userId: {$ne: userId}})
                .populate({path: "productCategory", model: "Category"})
                .populate({path: "userId", model: "User"})
                .populate('brand', ['brandName'])
                .populate('size', ['size'])
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .sort({createdAt: -1})
                .exec(function (err, products) {
                    if (err) {
                        return res.send({
                            code: httpResponseCode.BAD_REQUEST,
                            message: httpResponseMessage.INTERNAL_SERVER_ERROR
                        })
                    } else {
                        if (!products) {
                            res.json({
                                message: httpResponseMessage.USER_NOT_FOUND,
                                code: httpResponseMessage.BAD_REQUEST
                            });
                        } else {
                            return res.json({
                                code: httpResponseCode.EVERYTHING_IS_OK,
                                message: httpResponseMessage.LOGIN_SUCCESSFULLY,
                                result: products
                            });
                        }
                    }
                });
    } else {
        return res.status(403).send({code: 403, message: 'Unauthorized.'});
    }
}


/** Auther	: Rajiv kumar
 *  Date	: October 26, 2018
 *	Description : Function to get tradeMatchFilterBy for front-user
 **/
/*const tradeMatchFilterBy = (req, res) => {
 
 var sortObject = {};
 var condObject = {};
 var stype = "productName";
 var sdir = 1;
 if (req.body.sortBy != "" || req.body.sortBy != undefined) {
 if (req.body.sortBy == 1) {
 var stype = "createdAt";
 var sdir = 1;
 } else if (req.body.sortBy == 2) {
 var stype = "productName";
 var sdir = -1;
 } else if (req.body.sortBy == 3) {
 var stype = "productName";
 var sdir = 1;
 } else if (req.body.sortBy == 4) {
 var stype = "createdAt";
 var sdir = -1;
 
 }
 }
 sortObject[stype] = sdir;
 //console.log("Request Data",req.body)
 var perPage = constant.PER_PAGE_RECORD;
 var page = req.params.page || 1;
 var responseData = [];
 var token = getToken(req.headers);
 if (token) {
 decoded = jwt.verify(token, settings.secret);
 var userId = decoded._id;
 //    condObject["userId"] = userId;
 console.log("userInfo", decoded.loc[1]);
 if (req.body.category !== '') {
 condObject["productCategory"] = req.body.category;
 }
 if (req.body.sortBy == 4) {
 const distance = 10000 / 6371;
 
 var latitude = decoded.loc[1];
 var longitude = decoded.loc[0];
 
 
 var returnValue = getUser(latitude,longitude,distance, function(response){
 // Here you have access to your variable
 console.log('value',response);
 return response;
 });
 
 
 // const parameterMatch =  Location(latitude,longitude,distance);
 
 
 
 
 
 }
 
 
 Product.find(condObject)
 .populate({path: "productCategory", model: "Category"})
 .populate({path: "userId", model: "User"})
 .skip((perPage * page) - perPage)
 .limit(perPage)
 .sort(sortObject)
 .exec(function (err, products) {
 if (err) {
 return res.send({
 code: httpResponseCode.BAD_REQUEST,
 message: httpResponseMessage.INTERNAL_SERVER_ERROR
 })
 } else {
 if (!products) {
 res.json({
 message: httpResponseMessage.USER_NOT_FOUND,
 code: httpResponseMessage.BAD_REQUEST
 });
 } else {
 return res.json({
 code: httpResponseCode.EVERYTHING_IS_OK,
 message: httpResponseMessage.LOGIN_SUCCESSFULLY,
 result: products
 });
 }
 }
 });
 } else {
 return res.status(403).send({code: 403, message: 'Unauthorized.'});
 }
 }*/

/** Auther	: Rahul 
 *  Date	: Nov 01, 2018
 *	Description : Function to get tradeMatchFilterBy for front-user
 **/

const tradeMatchFilterBy = function (req, res) {
    async.waterfall([
        function (done) {
            var token = getToken(req.headers);
            if (token) {
                decoded = jwt.verify(token, settings.secret);
                var userId = decoded._id;

                if (req.body.sortBy == 4) {
                    const distance = 10000 / 6371;
                     
	                if(decoded.loc!=undefined && decoded.loc ){
                    var latitude = decoded.loc[1];
                    var longitude = decoded.loc[0];
					}
					else{
						var latitude = '77.1024901999999';
                    var longitude = '28.7040592';
					}
					console.log(userId);


                    User.find({_id: { $ne: ObjectId(userId) },'loc': {
                            $nearSphere: [
                                latitude,
                                longitude
                            ],
                            $maxDistance: distance

                        }
                        // branchId is the array [108,109,110]
                    }, {_id: 1})


                            .exec(function (err, challenge) {
                                if (err) {
                                    return responseData;

                                }

                                if (!challenge) {
                                    return responseData;
                                } else {



                                    done(err, challenge);

                                    //;

                                }

                            });

                } else {
                    User.find({_id: { $ne: ObjectId(userId) }}).exec(function (err, challenge) {
                                if (err) {
                                    return responseData;

                                }

                                if (!challenge) {
                                    return responseData;
                                } else {



                                    done(err, challenge);

                                    //;

                                }

                            });
                }

            }
        },
        function (user, done) {
             console.log(user.length);
            var sortObject = {};
            var condObject = {};
            var stype = "productName";
            var sdir = 1;
            if (req.body.category !== '') {
                condObject["productCategory"] = req.body.category;
            }
            if (req.body.sortBy != "" || req.body.sortBy != undefined) {
                if (req.body.sortBy == 1) {
                    var stype = "createdAt";
                    var sdir = 1;
                } else if (req.body.sortBy == 2) {
                    var stype = "productName";
                    var sdir = -1;
                } else if (req.body.sortBy == 3) {
                    var stype = "productName";
                    var sdir = 1;
                } else if (req.body.sortBy == 4) {
                    var stype = "createdAt";
                    var sdir = -1;

                }
            }
            sortObject[stype] = sdir;
            var perPage = constant.PER_PAGE_RECORD;
            var page = req.params.page || 1;
            var responseData = [];
            if (user.length) {
                Object.keys(user).forEach(function (key) {
                    responseData[key] = {};
                    responseData[key] = ObjectId(user[key]._id);
                });
                condObject["userId"] = responseData;
            }
			if(user.length==0 && req.body.sortBy == 4){
				responseData[0] = ObjectId("5b97b82a734e06514bc00000");
				condObject["userId"] = responseData;
			}
			condObject[""] = 
            Product.find(condObject)
                    .populate({path: "productCategory", model: "Category"})
                    .populate({path: "userId", model: "User"})
                    .skip((perPage * page) - perPage)
                    .limit(perPage)
                    .sort(sortObject)
                    .exec(function (err, products) {
                        if (err) {
                            return res.send({
                                code: httpResponseCode.BAD_REQUEST,
                                message: httpResponseMessage.INTERNAL_SERVER_ERROR
                            })
                            console.log("error");
                        } else {
                            if (!products) {
                                console.log("error1");
                                res.json({
                                    message: httpResponseMessage.USER_NOT_FOUND,
                                    code: httpResponseMessage.BAD_REQUEST
                                });
                            } else {
                                console.log("error2");
                                return res.json({
                                    code: httpResponseCode.EVERYTHING_IS_OK,
                                    message: httpResponseMessage.LOGIN_SUCCESSFULLY,
                                    result: products
                                });
                            }
                        }
                    });

        }
    ], function (err) {
        console.log('error');
    });
};

/** Auther	: Rajiv kumar
 *  Date	: Sept 7, 2018
 *	Description : Function to upload temp image  for front-user
 **/
const tepmUpload = (req, res) => {
    var form = new multiparty.Form();
    form.parse(req, function (err, data, files) {
        var uploadedFiles = [];
        var uiidv1 = uuidv1()
        for (var i = 0; i < files.file.length; i++) {
            if (files.file[i].size > 0) {
                uploadedFiles.push({
                    filename: files.file[i].originalFilename,
                    size: files.file[i].size,
                    path: 'public/assets/uploads/tepmUpload/' + files.file[i].originalFilename
                });
                fsExtra.move(files.file[i].path, constant.tepmUpload_path + files.file[i].originalFilename, function (err, uploaded) {
                    //if (err) return console.log(err);
                    // fs.rename(constant.product_path + files.file[i].originalFilename,constant.product_path +uiidv1+files.file[i].originalFilename, function (err) {
                    //   if (err) throw err;
                    //     console.log('File Renamed.');
                    // });
                });
            }
        }
        return res.json({
            code: httpResponseCode.EVERYTHING_IS_OK,
            message: httpResponseMessage.LOGIN_SUCCESSFULLY,
            result: uploadedFiles
        });
    });
}

/* #################################### Functions related to wishList functionality ############*/


/** Auther	: Rajiv kumar
 *  Date	: October 03, 2018
 *	Description : Function to add product into user wishlist
 **/
const addToWishList = (req, res) => {
//  console.log("addToWishList",req.body)
    var token = getToken(req.headers);
    if (token) {
        decoded = jwt.verify(token, settings.secret);
        var userId = decoded._id;
        req.body.userId = userId
        WishList.create(req.body, (err, result) => {
            if (err) {
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

    } else {
        return res.status(403).send({code: 403, message: 'Unauthorized.'});
    }
}

/** Auther	: Rajiv kumar
 *  Date	: October 03, 2018
 *	Description : Function to add product into user wishlist
 **/
const removeFromWishList = (req, res) => {
    var token = getToken(req.headers);
    if (token) {
        decoded = jwt.verify(token, settings.secret);
        var userId = decoded._id;
        try {
            WishList.deleteMany({userId: req.body.userId, productId: req.body.productId}, (err, result) => {
                if (err) {
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
            // db.orders.( { "_id" : ObjectId("563237a41a4d68582c2509da") } );
        } catch (e) {
            return res.json({
                message: httpResponseMessage.ITEM_NOT_FOUND,
                code: httpResponseMessage.NOT_FOUND,
                error: e
            });
        }

    } else {
        return res.status(403).send({code: 403, message: 'Unauthorized.'});
    }
}

/** Auther	: Rajiv kumar
 *  Date	: October 03, 2018
 *	Description : Function to list user wishlist
 **/
const wishList = (req, res) => {
    var token = getToken(req.headers);
    if (token) {
        decoded = jwt.verify(token, settings.secret);
        var userId = decoded._id;
        WishList.find({})
                .populate('userId')
                .populate('userId', ['firstName', 'lastName', 'userName', 'profilePic'])
                .populate({path: 'productId', model: 'Product', populate: [{path: "productCategory", model: "Category"}]})
                .exec(function (err, result) {
                    console.log("result", result)
                    if (err) {
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

    } else {
        return res.status(403).send({code: 403, message: 'Unauthorized.'});
    }
}
/** Auther	: Rajiv kumar
 *  Date	: October 03, 2018
 *	Description : Function to clear the Product from user wishlist
 **/
const clearWishlist = (req, res) => {
    var token = getToken(req.headers);
    if (token) {
        decoded = jwt.verify(token, settings.secret);
        var userId = decoded._id;
        WishList.deleteMany({userId: userId}, (err, result) => {
            if (err) {
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

    } else {
        return res.status(403).send({code: 403, message: 'Unauthorized.'});
    }
}
/** Auther	: Rajiv kumar
 *  Date	: June 22, 2018
 */
/// function to list all dinated products
const getColors = (req, res) => {
	resultAdd = constant.colors;
	return res.json({
		code: httpResponseCode.EVERYTHING_IS_OK,
		message: httpResponseMessage.SUCCESSFULLY_DONE,
		result: resultAdd
	});
}

module.exports = {
  create,
  allProducts,
  viewProduct,
  updateProduct,
  deleteProduct,
  changeStatus,
  popularItems,
  switchTodays,
  myTreasureChest,
  addProduct,
  tepmUpload,
  activeProducts,
  searchresult,
  myTreasureChestFilterBy,
  filterBycategory,
  productDetails,
  productImages,
  wishList,
  addToWishList,
  clearWishlist,
  relatedCategoryProduct,
  checkExists,
  removeFromWishList,
  tradeMatch,
  tradeMatchFilterBy,
  getColors
}
