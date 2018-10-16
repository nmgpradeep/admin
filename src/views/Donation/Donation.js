import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
import ReadMoreReact from 'read-more-react';
import { Button, Modal} from 'reactstrap';
import axios from 'axios';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
var FD = require('form-data');
var fs = require('fs');
class Donation extends Component {
  constructor(props){
    super(props);
    this.state = {
      conditionsConstant :[],
      conditionsShippingStatus :[],
    };
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

	componentWillMount(){
		console.log('componentWillMount from donation')
	}

  componentDidMount() {
	   axios.get('/donation/getdonationStatus').then(result => {
           this.setState({conditionsConstant: result.data.result});
       });
	   axios.get('/donation/getdonationshippingStatus').then(result => {
           this.setState({conditionshippingStatus: result.data.result});
       });
  }

   changeStatus (Obj,Obj1){

	    const updateData = new FD();
		updateData.append('_id',Obj);
		updateData.append('value',Obj1.target.value);
		updateData.append('field','productStatus');
         axios.post('/donation/updateStatus',updateData).then(result => {
		      if(result.data.code === 200){
               window.location.reload();
             }
	     });
   }

   // shippingStatus (Obj,Obj1){
	 //    const updateData = new FD();
		// updateData.append('_id',Obj);
		// updateData.append('value',Obj1.target.value);
		// updateData.append('field','shippingStatus');
   //       axios.post('/donation/updateStatus',updateData).then(result => {
		//       if(result.data.code === 200){
   //             window.location.reload();
   //           }
	 //     });
   // }

  render() {
	  let optionTemplate;
	    if(this.state.conditionsConstant){
			let conditionsList = this.state.conditionsConstant;
		    optionTemplate = conditionsList.map(v => (<option value={v.id}>{v.name}</option>));
        }
        console.log('PTOPS', this.props)
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
        <td>{(this.props.donation.category[0])?this.props.donation.category[0].title:''}</td>
        <td>
           <Link to='#' className="mousePointer" onClick={this.props.onflagUsers.bind(this, (this.props.donation.user[0])?this.props.donation.user[0]._id:'')} className="mr-1">
             {(this.props.donation.user[0])?this.props.donation.user[0].firstName:''}
          </Link>
        </td>
        <td>{this.props.donation.size[0]?this.props.donation.size[0].size:""}</td>
        <td>{this.props.donation.color}</td>
        <td>{this.props.donation.brand[0]?this.props.donation.brand[0].brandName:""}</td>
        <td>{this.props.donation.productAge}</td>
        <td><img src={'assets/uploads/donationImage/'+this.props.donation.productImage} className="avatar" alt=""/></td>
        <td>
         <select id="select" innerRef={input => (this.productStatus = input)} value={this.props.donation.productStatus} className="dropdown-toggle btn btn-info"
         onChange={this.changeStatus.bind(this, this.props.donation._id)}>
			{optionTemplate}
		  </select>
        </td>
        <td>
             <select id="select"
              innerRef={input => (this.shippingStatus = input)}
              className="dropdown-toggle btn btn-info"
              onChange={(e) => this.props.changeShippingStatus(e, this.props.donation._id)}
              value={this.props.donation.shippingStatus}
              disabled={this.props.donation.productStatus !== "1"}>
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
