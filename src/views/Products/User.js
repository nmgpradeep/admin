import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
// import PropTypes from 'prop-types';
class User extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
       <option value={this.props.user._id}>{this.props.user.firstName} {this.props.user.lastName}</option>	
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default User;
