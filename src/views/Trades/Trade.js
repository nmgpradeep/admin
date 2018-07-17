import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
// import PropTypes from 'prop-types';
class Trade extends Component {
  constructor(props){
    super(props);
    
  }
  render() {
    return (
      <tr key={this.props.trade._id}>
        <td>1</td>
        <td>{this.props.trade.senderId}</td>
        
        <td>{this.props.trade.senderProductId}</td>
        <td>{this.props.trade.receiverId}</td>
        <td>{this.props.trade.receiverProductId}</td>
        <td>{Moment(this.props.trade.createdAt).format('d MMM YYYY')}</td>
        <td>
          <Badge onClick={this.props.changeStatus.bind(this, this.props.trade)} color={(this.props.trade.status == '1')?'success':'danger'}>
            {(this.props.trade.status == '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>
         
          <Link to={'/trades/view/' + this.props.trade._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
         
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Trade;
