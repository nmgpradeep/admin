import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
import ReadMoreReact from 'read-more-react';
import { Button, Modal} from 'reactstrap';
import axios from 'axios';
// import PropTypes from 'prop-types';


class Donation extends Component {
  constructor(props){
    super(props);
    this.state = {
      conditionsConstant :[],
      conditionsShippingStatus :[],
    };
  }
  
  componentDidMount() {
	   axios.get('/donation/getdonationStatus').then(result => {
           this.setState({conditionsConstant: result.data.result});   
       });
	   axios.get('/donation/getdonationshippingStatus').then(result => {
           this.setState({conditionshippingStatus: result.data.result});  
           console.log('ccccccc',this.state.conditionshippingStatus);         
       });
      
  }
  render() {
	  let optionTemplate;
	    if(this.state.conditionsConstant){
			let conditionsList = this.state.conditionsConstant;
		    optionTemplate = conditionsList.map(v => (<option value={v.id}>{v.name}</option>));
        }	
         
	  let optionShippings;
	    if(this.state.conditionshippingStatus){
			let conditionsShippings = this.state.conditionshippingStatus;
		    optionShippings = conditionsShippings.map(v => (<option value={v.id}>{v.name}</option>));
        }	 
	  
    return (
      <tr key={this.props.donation._id}>
      <td>{this.props.sequenceNo+1}</td>
        <td>{this.props.donation.productName}</td>
        <td><ReadMoreReact text={this.props.donation.description.replace(/<(?:.|\n)*?>/gm, '')} min={1}  ideal={100} max={200} /></td>        
        <td>{(this.props.donation.productCategory)?this.props.donation.productCategory.title:''}</td>
        <td>
           <Link to='#' className="mousePointer" onClick={this.props.onflagUsers.bind(this, this.props.donation.userId._id)} className="mr-1">
             {(this.props.donation.userId)? this.props.donation.userId.firstName:''}
          </Link>
        </td>   
        <td>{this.props.donation.size?this.props.donation.size.size:""}</td>
        <td>{this.props.donation.color}</td>
        <td>{this.props.donation.brand?this.props.donation.brand.brandName:""}</td>
        <td>{this.props.donation.productAge}</td>
        <td><img src={'assets/uploads/donationImage/'+this.props.donation.productImage} className="avatar" alt=""/></td>
        <td>
         <select id="select" innerRef={input => (this.productStatus = input)} className="form-control" onChange={this.conditionsChange}>
			{optionTemplate}
		  </select>                      
        </td>
        <td>
         <select id="select" innerRef={input => (this.shippingStatus = input)} className="form-control" onChange={this.conditionsChange}>
			{optionShippings}
		  </select>                      
        </td>
        <td>
          <Link to={'/donations/edit/' + this.props.donation._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          <Link to={'/donations/view/' + this.props.donation._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
          <i className="fa fa-trash fa-md mousePointer" onClick={this.props.onDeleteDonation.bind(this, this.props.donation._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Donation;
