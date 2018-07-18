import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
// import PropTypes from 'prop-types';
class Testimonial extends Component {
  constructor(props){
    super(props);
  }

Capitalize(str){
	return str.charAt(0).toUpperCase() + str.slice(1);
}
  render() {
    return (
      <tr key={this.props.testimonial._id}>
      <td>{this.props.sequenceNo+1}</td>
        <td>{this.props.testimonial.title}</td>
        <td>{this.props.testimonial.description}</td>
        <td>{this.Capitalize(this.props.testimonial.author.firstName)} {this.Capitalize(this.props.testimonial.author.lastName)}</td>   
        <td>
          <Badge onClick={this.props.changeStatus.bind(this, this.props.testimonial)} color={(this.props.testimonial.status == '1')?'success':'danger'}>
            {(this.props.testimonial.status == '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>
          <Link to={'/testimonial/edit/' + this.props.testimonial._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          <Link to={'/testimonial/view/' + this.props.testimonial._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
          <i className="fa fa-trash fa-md"  onClick={this.props.onDeleteTestimonial.bind(this, this.props.testimonial._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Testimonial;
