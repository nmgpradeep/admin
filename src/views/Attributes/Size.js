import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
// import PropTypes from 'prop-types';
class Size extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <tr key={this.props.size._id}>
      <td>{this.props.sequenceNo+1}</td>
        <td>{this.props.size.size}</td>
        <td>{(this.props.size.category)?this.props.size.category.title:''}</td>
       
        <td>
          <Link to={'/size/edit/' + this.props.size._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          {/* <Link to={'/testimonial/view/' + this.props.testimonial._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link> */}
          <i className="fa fa-trash fa-md mousePointer"  onClick={this.props.onDeleteSize.bind(this, this.props.size._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Size;
