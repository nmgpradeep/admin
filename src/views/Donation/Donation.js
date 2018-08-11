import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
import ReadMoreReact from 'read-more-react';
// import PropTypes from 'prop-types';
class Donation extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <tr key={this.props.donation._id}>
      <td>{this.props.sequenceNo+1}</td>
        <td>{this.props.donation.productName}</td>
        <td><ReadMoreReact text={this.props.donation.description.replace(/<(?:.|\n)*?>/gm, '')} min={1}  ideal={100} max={200} /></td>        
        <td>{(this.props.donation.productCategory)?this.props.donation.productCategory.title:''}</td>
        <td>{(this.props.donation.userId)? this.props.donation.userId.firstName:''}</td>
        <td>{this.props.donation.size}</td>
        <td>{this.props.donation.color}</td>
        <td>{this.props.donation.brand}</td>
        <td>{this.props.donation.productAge}</td>
        <td><img src={'assets/uploads/donationImage/'+this.props.donation.productImage} className="avatar" alt=""/></td>
        <td>
          <Badge className="mousePointer" onClick={this.props.changeStatus.bind(this, this.props.donation)} color={(this.props.donation.productStatus == '1')?'success':'danger'}>
            {(this.props.donation.productStatus == '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>
          <Link to={'/donations/edit/' + this.props.donation._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          <Link to={'/donations/view/' + this.props.donation._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
          <i className="fa fa-trash fa-md mousePointer"  onClick={this.props.onDeleteDonation.bind(this, this.props.donation._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Donation;
