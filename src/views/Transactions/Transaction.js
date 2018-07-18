import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
// import PropTypes from 'prop-types';
class Transaction extends Component {
  constructor(props){
       super(props);
  }
  render() {
    return (
      <tr key={this.props.transaction._id}>
      <td>{this.props.sequenceNo+1}</td>
        <td>{this.props.transaction.transactionType}</td>
        <td>{this.props.transaction.userId}</td>
        <td>{this.props.transaction.paymentId}</td>
        <td>{this.props.transaction.transactionDate}</td>
        <td>{this.props.transaction.transactionAmount}</td>
        <td>
           <Badge onClick={this.props.changeStatus.bind(this, this.props.transaction)} color= {(this.props.transaction.status === '1')?'success':'danger'}>
            {(this.props.transaction.status === '1')?'Active':'Inctive'}
          </Badge>
         
        </td>
        <td>
          <Link to={'/transactions/view/' + this.props.transaction._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Transaction;
