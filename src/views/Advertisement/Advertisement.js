import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
// import PropTypes from 'prop-types';
class Advertisement extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <tr key={this.props.adv._id}>
        <td>{this.props.adv.advertisemetName}</td>
        {/* <td>{this.props.adv.Description}</td> */}
        <td>{this.props.adv.image}</td>
        <td>{this.props.adv.redirectURL}</td>   
        <td>
          <Badge onClick={this.props.changeStatus.bind(this, this.props.adv)} color={(this.props.adv.advStatus === '1')?'success':'danger'}>
            {(this.props.adv.advStatus === '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>
          <Link to={'/advertisement/edit/' + this.props.adv._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          <Link to={'/advertisement/view/' + this.props.adv._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
          <i className="fa fa-trash fa-md"  onClick={this.props.onDeleteAdv.bind(this, this.props.adv._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Advertisement;
