import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
// import PropTypes from 'prop-types';
class Subscription extends Component {
  //~ constructor(props){
    //~ super(props);
  //~ }
  render() {
    return (
      <tr key={this.props.subscription._id}>
      <td>{this.props.sequenceNo+1}</td>
        <td>{this.props.subscription.subscriptionName}</td>
        <td>{this.props.subscription.description}</td>
        <td>{this.props.subscription.price}</td>
        <td>{this.props.subscription.totalTradePermitted}</td>
        <td>{this.props.subscription.totalInventoryAllowed}</td>
        <td>{this.props.subscription.timePeriod}</td>       
        <td>{Moment(this.props.subscription.createdAt).format('d MMM YYYY')}</td>
        <td>
          <Badge className="mousePointer" onClick={this.props.changeStatus.bind(this,this.props.subscription)} color= {(this.props.subscription.status === '1')?'danger':'success'}>
            {(this.props.subscription.status === '1')?'Inctive':'Active'}
          </Badge>
        </td>
        <td>
          <Link to={'/subscriptions/edit/' + this.props.subscription._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          <Link to={'/subscriptions/view/' + this.props.subscription._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
          <i className="fa fa-trash fa-md mousePointer" onClick={this.props.onDeleteSubscription.bind(this, this.props.subscription._id)}></i>&nbsp;
        </td>
      </tr>
    );
  }
}
export default Subscription;
