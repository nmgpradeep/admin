const Easypost = require('@easypost/api');
const constant = require("../../common/constant");
const api = new Easypost(constant.EasyPostApiKey);

/**
*function createShipment to create a shipment
*@param toAddress : the address infromation of the user who is receiving the consignment
*@param fromAddress : the address infromation of the user who is sending the consignment
*toAddress & fromAddress example
*{
    "city": "Redondo Beach",
    "company": null,
    "country": "US",
    //"created_at": "2013-11-08T15:49:58Z",
    "email": "dr_steve_brule@gmail.com",
    //"id": "adr_EyDCpoii",
    "mode": "test",
    "name": "Dr. Steve Brule",
    "object": "Address",
    "phone": null,
    "state": "CA",
    "street1": "179 N Harbor Dr",
    "street2": null,
    //"updated_at": "2013-11-08T15:49:58Z",
    "zip": "90277"
  }
*@param parcel  : the parcel information in the format
*{
    //"id": "prcl_SI55pjx8",
    //"object": "Parcel",
    "length": 20.2,
    "width": 10.9,
    "height": 5.0,
    //"predefined_package": null,
    "weight": 140.8,
    //"created_at": "2013-04-22T05:39:57Z",
    //"updated_at": "2013-04-22T05:39:57Z"
}
*
*@returns the information as written below:
*
{
  "id": "shp_vN9h7XLn",
  "object": "Shipment",
  "mode": "test",
  "options": {"address_validation_level": "0"},
  "to_address": {
    "city": "Redondo Beach",
    "company": null,
    "country": "US",
    "created_at": "2013-11-08T15:49:58Z",
    "email": "dr_steve_brule@gmail.com",
    "id": "adr_EyDCpoii",
    "mode": "test",
    "name": "Dr. Steve Brule",
    "object": "Address",
    "phone": null,
    "state": "CA",
    "street1": "179 N Harbor Dr",
    "street2": null,
    "updated_at": "2013-11-08T15:49:58Z",
    "zip": "90277"
  },
  "from_address": {
    "city": "San Francisco",
    "company": null,
    "country": "US",
    "created_at": "2013-11-08T15:49:59Z",
    "email": null,
    "id": "adr_faGeob9S",
    "mode": "test",
    "name": "EasyPost",
    "object": "Address",
    "phone": "415-379-7678",
    "state": "CA",
    "street1": "417 Montgomery Street",
    "street2": "5th Floor",
    "updated_at": "2013-11-08T15:49:59Z",
    "zip": "94104"
  },
  "parcel": {
    "id": "prcl_SI55pjx8",
    "object": "Parcel",
    "length": 20.2,
    "width": 10.9,
    "height": 5.0,
    "predefined_package": null,
    "weight": 140.8,
    "created_at": "2013-04-22T05:39:57Z",
    "updated_at": "2013-04-22T05:39:57Z"
  },
  "customs_info": {
    "id": "cstinfo_iNAizey5",
    "object": "CustomsInfo",
    "created_at": "2013-04-22T05:39:57Z",
    "updated_at": "2013-04-22T05:39:57Z",
    "contents_explanation": null,
    "contents_type": "merchandise",
    "customs_certify": false,
    "customs_signer": null,
    "eel_pfc": null,
    "non_delivery_option": "return",
    "restriction_comments": null,
    "restriction_type": "none",
    "customs_items": [
      {
        "id": "cstitem_9eDIbaDR",
        "object": "CustomsItem",
        "description": "Many, many EasyPost stickers.",
        "hs_tariff_number": "123456",
        "origin_country": "US",
        "quantity": 1,
        "value": 879,
        "weight": 140,
        "created_at": "2013-04-22T05:39:57Z",
        "updated_at": "2013-04-22T05:39:57Z"
      }
    ]
  },
  "rates": [
    {
      "id": "rate_nyCb6ubX",
      "object": "Rate",
      "service": "FirstClassPackageInternationalService",
      "rate": "9.50",
      "carrier": "USPS",
      "shipment_id": "shp_vN9h7XLn",
      "delivery_days": 4,
      "delivery_date": "2013-04-26T05:40:57Z",
      "delivery_date_guaranteed": false,
      "created_at": "2013-04-22T05:40:57Z",
      "updated_at": "2013-04-22T05:40:57Z"
    }
    ...
  ],
  "scan_form": null,
  "selected_rate": null,
  "postage_label": null,
  "tracking_code": null,
  "refund_status": null,
  "insurance": null,
  "created_at": "2013-04-22T05:40:57Z",
  "updated_at": "2013-04-22T05:40:57Z"
}
*/
createShipment = (toAddress,fromAddress, parcel) => {
  const toAddress = new api.Address(toAddress);
  const fromAddress = new api.Address(fromAddress);
  const parcel = new api.Parcel(parcel);
  return new api.Shipment({
    parcel,
    to_address: toAddress,
    from_address: fromAddress,
    options: {
      address_validation_level: 0
    }
  });
}

/**
*function refundShipment to refund a shipment
*
*/
refundShipment = (shipmentId) => {
  return api.Shipment.retrieve(shipmentId).then(s => {
    s.refund();//.then(() => console.log(s));
  });
}

module.exports = {
  createShipment,
  refundShipment
};
