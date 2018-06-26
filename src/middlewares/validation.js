const validator = require('validator');
const httpResponseCode=require('../helpers/httpResponseCode')
const httpResponseMessage=require('../helpers/httpResponseMessage')
const validate_request = {
    validate_all_request: function (request_body, require_parameter) {
        for (var require_key in require_parameter) {
            switch (require_parameter[require_key]) {
                case 'email':
                    if (!request_body['email']) {
                        return {code: 403, message: "Email-id is required"};
                    }
                    else {
                        if(!validator.isEmail(request_body['email'])){
                            return {code:httpResponseCode.BAD_REQUEST, message:httpResponseMessage.CORRECT_EMAIL};
                        }
                     //   return true
                    }
                    break;
                case 'phoneNumber':
                    if (!request_body['phoneNumber']) {
                        return {code:403,  message:"Phone number is required"};
                    }
                    break;
                case 'password':
                    if (!request_body['password']) {
                        return {code:403,  message: "password is required"};
                    }
                    break;


                case 'name':
                    if (!request_body['name']) {
                        return {code: 403, message: " name is required"};
                    }
                    break;
                case 'accessToken':
                    if (!request_body['accessToken']) {
                        return {code:403,message: "access Token is required"};
                    }
                    break;
                 case 'deviceToken':
                    if (!request_body['deviceToken']) {
                        return {code:403,message: "Device token is required"};
                    }
                    break;
                case 'facebookId':
                    if (!request_body['facebookId']) {
                        return {code:403,message: "facebookId is required"};
                    }
                    break;
                     case 'googleId':
                    if (!request_body['googleId']) {
                        return {code:403,message: "googleId is required"};
                    }
                    break;
                       case 'socialId':
                    if (!request_body['socialId']) {
                        return {code:403,message: "socialId is required"};
                    }
                    break;
                case 'cardNumber':
                    if (!request_body['cardNumber']) {
                        return {code:403,message: "Card Number is required"};
                    }
                    break;
                     case 'registrationType':
                    if (!request_body['registrationType']) {
                        return {code:403,message: "Registration Type is required"};
                    }
                    break;
                     case 'userType':
                    if (!request_body['userType']) {
                        return {code:403,message: "userType is required"};
                    }
                    break;
                     case 'latitude':
                    if (!request_body['latitude']) {
                        return {code:403,message: "latitude is required"};
                    }
                    break;
                     case 'longitude':
                    if (!request_body['longitude']) {
                        return {code:403,message: "longitude is required"};
                    }
                    break;
                     case 'cardNumber':
                    if (!request_body['cardNumber']) {
                        return {code:403,message: "Card Number is required"};
                    }
                    break;
                     case 'name':
                    if (!request_body['name']) {
                        return {code:403,message: "Name on is required"};
                    }
                    break;
                     case 'cvv':
                    if (!request_body['cvv']) {
                        return {code:403,message: "Cvv is required"};
                    }
                    break;

                case 'cardExpiry':
                    if (!request_body['cardExpiry']) {
                        return {code:403,message: "card Expiry is required"};
                    }
                    break;
                case 'cardType':
                    if (!request_body['cardType']) {
                        return {code:403,message: "Card type is required"};
                    }
                    break;
                case 'userId':
                    if (!request_body['userId']) {
                        return {code:403,message: "User Id is required"};
                    }
                    break;
                      case 'supplierId':
                    if (!request_body['supplierId']) {
                        return {code:403,message: "Supplier Id is required"};
                    }
                     case 'productId':
                    if (!request_body['productId']) {
                        return {code:403,message: "Product Id is required"};
                    }
                    break;
                     case 'orderId':
                    if (!request_body['orderId']) {
                        return {code:403,message: "orderId Id is required"};
                    }
                    break;
                    case 'addressId':
                    if (!request_body['addressId']) {
                        return {code:403,message: "address  Id is required"};
                    }
                    break;
                     case 'cardId':
                    if (!request_body['cardId']) {
                        return {code:403,message: "card  Id is required"};
                    }
                    break;
                case 'country_code':
                    if (!request_body['country_code']) {
                        return {code:403,message: "country code is required"};
                    }
                    break;
                case 'otp':
                    if (!request_body['otp']) {
                        return {code:403,message: "OTP is required"};
                    }
                    break;
                case 'referral_code':
                    if (!request_body['referral_code']) {
                        return {code:403,message: "referral code is required"};
                    }
                    break;
                case 'bucket_name':
                    if (!request_body['bucket_name']) {
                        return {code:403,message: "Bucket name is required"};
                    }
                    break;
                case 'bucket_image':
                    if (!request_body['bucket_image']) {
                        return {code:403,message: "Bucket image is required"};
                    }
                    break;
                case 'service_id':
                    if (!request_body['service_id']) {
                        return {code:403,message: "Service id is required"};
                    }
                    break;
                case 'vendor_id':
                    if (!request_body['vendor_id']) {
                        return {code:403,message: "Vendor id is required"};
                    }
                    break;
                case 'user':
                    if (!request_body['user']) {
                        return {code:403,message: "User is required"};
                    }
                    break;
                case 'action':
                    if (!request_body['action']) {
                        return {code:403,message: "Action is required"};
                    }
                    break;
                case 'vehicle_id':
                    if (!request_body['vehicle_id']) {
                        return {code:403,message: "Please select a Vehicle"};
                    }
                    break;
                case 'type':
                    if (!request_body['type']) {
                        return {code:403,message: "Type is required"};
                    }
                    break;
                case 'vehicle_id':
                    if (!request_body['address']) {
                        return {code:403,message: "Address is required"};
                    }
                    break;
                case 'location':
                    if (!request_body['location']) {
                        return {code:403,message: "Location is required"};
                    }
                    break;
                case 'place_id':
                    if (!request_body['place_id']) {
                        return {code:403,message: "Please enter place id"};
                    }
                    break;
                case 'oldPassword':
                    if (!request_body['oldPassword']) {
                        return {code:403,message: "Please enter old password"};
                    }
                    break;
                case 'newPassword':
                    if (!request_body['newPassword']) {
                        return {code:403,message: "Please enter new password"};
                    }
                    break;
                case 'key':
                    if (!request_body['key']) {
                        return {code:403,message: "key is required"};
                    }
                    break;
                case 'seq':
                    if (!request_body['seq']) {
                        return {code:403,message: "sequence is required"};
                    }
                    break;
                case 'answer':
                    if (!request_body['answer']) {
                        return {code:403,message: "Answer is required"};
                    }
                    break;
            }
        }
    }
}
module.exports = validate_request;
