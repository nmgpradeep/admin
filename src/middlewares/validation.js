const validator = require('validator');
const EmailValidator = require("email-validator");
const httpResponseCode=require('../helpers/httpResponseCode')
const httpResponseMessage=require('../helpers/httpResponseMessage')
const validate_request = {
    validate_all_request: function (request_body, require_parameter) {
        for (var require_key in require_parameter) {
            switch (require_parameter[require_key]) {
                case 'email':
                    if (!request_body['email']) {
						             return ({ code: 403, message: "Email-id is required"});
                        //return [403, "Email-id is required"];
                    }
                    else {
                    //  console.log("Resp",validator.isEmail(request_body['email']))
                        if(!EmailValidator.validate(request_body['email'])){
							              return ({ code: httpResponseCode.FORBIDDEN, message: httpResponseMessage.CORRECT_EMAIL});
                              // return [httpResponseCode.BAD_REQUEST,httpResponseMessage.CORRECT_EMAIL];
                        }
                     //   return true
                    }
                    break;
                case 'phoneNumber':
                    if (!request_body['phoneNumber']) {
                       return ({ code: httpResponseCode.FORBIDDEN, message:"Phone number is required"});
                    }
                    break;
                case 'password':
                    if (!request_body['password']) {
                       return ({ code: httpResponseCode.FORBIDDEN, message:"password is required"});
                    }
                    break;
                case 'name':
                    if (!request_body['name']) {
                       return ({ code: httpResponseCode.FORBIDDEN, message:"Name is required"});
                    }
                    break;
                case 'accessToken':
                    if (!request_body['accessToken']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Access Token is required"});
                    }
                    break;
                 case 'deviceToken':
                    if (!request_body['deviceToken']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Device token is required"});
                    }
                    break;
                case 'facebookId':
                    if (!request_body['facebookId']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"facebookId is required"});
                    }
                    break;
                case 'googleId':
                    if (!request_body['googleId']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Google Id is required"});
                    }
                    break;
                case 'socialId':
                    if (!request_body['socialId']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"socialId is required"});
                    }
                    break;
                case 'cardNumber':
                    if (!request_body['cardNumber']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Card Number is required"});
                    }
                    break;
               case 'registrationType':
                    if (!request_body['registrationType']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Registration Type is required"});
                    }
                    break;
                case 'userType':
                    if (!request_body['userType']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"userType is required"});
                    }
                    break;
                case 'latitude':
                    if (!request_body['latitude']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"latitude is required"});
                    }
                    break;
                case 'longitude':
                   if (!request_body['longitude']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"longitude is required"});
                    }
                    break;
                case 'cardNumber':
                    if (!request_body['cardNumber']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"password is required"});
                    }
                    break;
                case 'name':
                    if (!request_body['name']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Name on is required"});
                    }
                    break;
                case 'cvv':
                    if (!request_body['cvv']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Cvv is required"});
                    }
                    break;

                case 'cardExpiry':
                    if (!request_body['cardExpiry']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"card Expiry is required"});
                    }
                    break;
                case 'cardType':
                    if (!request_body['cardType']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Card type is required"});
                    }
                    break;
                case 'userId':
                    if (!request_body['userId']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"User Id is required"});

                    }
                    break;
                case 'productId':
                    if (!request_body['productId']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Product Id is required"});
                    }
                    break;
                case 'addressId':
                    if (!request_body['addressId']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Address  Id is required"});
                    }
                    break;
                case 'country_code':
                    if (!request_body['country_code']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"country code is required"});
                    }
                    break;
                case 'bucket_name':
                    if (!request_body['bucket_name']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Bucket name is required"});
                    }
                    break;
                case 'bucket_image':
                    if (!request_body['bucket_image']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Bucket image is required"});
                    }
                    break;
                case 'service_id':
                    if (!request_body['service_id']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Service id is required"});
                    }
                    break;
                case 'vendor_id':
                    if (!request_body['vendor_id']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Vendor id is required"});
                    }
                    break;
                case 'user':
                    if (!request_body['user']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"User is required"});
                    }
                    break;
                case 'action':
                    if (!request_body['action']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Action is required"});
                    }
                    break;
                case 'vehicle_id':
                    if (!request_body['vehicle_id']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Please select a Vehicle"});
                    }
                    break;
                case 'type':
                    if (!request_body['type']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Type is required"});
                    }
                    break;

                case 'location':
                    if (!request_body['location']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Location is required"});
                    }
                    break;

                case 'oldPassword':
                    if (!request_body['oldPassword']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Please enter old password"});
                    }
                    break;
                case 'newPassword':
                    if (!request_body['newPassword']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Please enter new password"});
                    }
                    break;
                case 'key':
                    if (!request_body['key']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"key is required"});
                    }
                    break;
                case 'seq':
                    if (!request_body['seq']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Sequence is required"});
                    }
                    break;
                case 'answer':
                    if (!request_body['answer']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Answer is required"});
                    }
                    break;
                case 'categoryName':
                    if (!request_body['categoryName']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"categoryName is required"});
                    }
                    break;
                case 'productCategory':
                    if (!request_body['productCategory']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"productCategory is required"});
                    }
                    break;
                case 'subscriptionName':
                    if (!request_body['subscriptionName']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Subscription Name is required"});
                    }
                    break;
                case 'packageName':
                    if (!request_body['packageName']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Package Name is required"});
                    }
                    break;
                case 'advertisementName':
                    if (!request_body['advertisementName']) {
						return ({ code: httpResponseCode.FORBIDDEN, message:"Advertisement Name is required"});
                    }
                    break;
            }
        }
    }
}
module.exports = validate_request;
