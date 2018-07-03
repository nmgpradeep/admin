import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
// import PropTypes from 'prop-types';

class Donation extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <tr key={this.props.donation._id}>
		
        <td>{this.props.donation.productName}</td>
        <td>{this.props.donation.description}</td>
        <td>{this.props.donation.productCategory}</td>  
        <td>{this.props.donation.userId}</td>
        <td>{this.props.donation.size}</td>
        <td>{this.props.donation.color}</td>  
        <td>{this.props.donation.brand}</td>
        <td>{this.props.donation.productAge}</td>        
        <td>
          <Badge  color={(this.props.donation.productStatus === '1')?'success':'danger'}>
            {(this.props.donation.productStatus === '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>
          <Link to={'/donation/edit/' + this.props.donation._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          <Link to={'/donation/view/' + this.props.donation._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
          <i className="fa fa-trash fa-md" ></i>&nbsp;
        </td>
      </tr>
    );
  }
}

export default Donation;
