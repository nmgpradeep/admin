import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
// import PropTypes from 'prop-types';
class Conditions extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
       <option value={this.props}>{this.props}</option>	
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Conditions;
