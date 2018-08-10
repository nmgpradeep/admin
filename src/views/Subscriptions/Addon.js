import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
// import PropTypes from 'prop-types';
class Addon extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <tr key={this.props.addon._id}>
      <td>{this.props.sequenceNo+1}</td>
        <td>{this.props.addon.packageName}</td>
        <td>{this.props.addon.description}</td>
        <td>{this.props.addon.price}</td>
        <td>{this.props.addon.totalTradePermitted}</td>
        <td>{this.props.addon.totalInventoryAllowed}</td>   
        <td>
          <Badge className="mousePointer" onClick={this.props.changeStatus.bind(this, this.props.addon)} color={(this.props.addon.status == '1')?'success':'danger'}>
            {(this.props.addon.status == '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>
          <Link to={'/addon/edit/' + this.props.addon._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          {/* <Link to={'/testimonial/view/' + this.props.testimonial._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link> */}
          <i className="fa fa-trash fa-md mousePointer" onClick={this.props.onDeleteAddon.bind(this, this.props.addon._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Addon;
