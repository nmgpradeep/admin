import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
// import PropTypes from 'prop-types';
class Trade extends Component {
  constructor(props){
    super(props);
    this.props.user.tradeStatus = 1;
  }
  render() {
    return (
      <tr key={this.props.user._id}>
        <td>1</td>
        <td>{this.props.user.senderId}</td>
        <td>{this.props.user.receiverId}</td>
        <td>{this.props.user.senderProductId}</td><td>{this.props.user.receiverProductId}</td>
        <td>{Moment(this.props.user.createdAt).format('d MMM YYYY')}</td>
        <td>
          <Badge  color={(this.props.user.tradeStatus === '1')?'success':'danger'}>
            {(this.props.user.tradeStatus === '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>
         
          <Link to={'#'}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
         
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Trade;
