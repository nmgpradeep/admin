import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
import ReactStars from 'react-stars'
import ReadMoreReact from 'read-more-react';
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
        <td><ReadMoreReact text={this.props.testimonial.description.replace(/<(?:.|\n)*?>/gm, '')} min={1}  ideal={100} max={200} /></td>
        <td>{(this.props.testimonial.author)?this.Capitalize(this.props.testimonial.author.firstName):''} {(this.props.testimonial.author)?this.Capitalize(this.props.testimonial.author.lastName):''}</td>   
        <td>
         <ReactStars  count={5} size={15} color2={'#ffd700'} edit={false} value={this.props.testimonial.review}  /></td>
        <td>
          <Badge className="mousePointer" onClick={this.props.changeStatus.bind(this, this.props.testimonial)} color={(this.props.testimonial.status == '1')?'success':'danger'}>
            {(this.props.testimonial.status == '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>
          <Link to={'/testimonial/edit/' + this.props.testimonial._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          <Link to={'/testimonial/view/' + this.props.testimonial._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
          <i className="fa fa-trash fa-md mousePointer"  onClick={this.props.onDeleteTestimonial.bind(this, this.props.testimonial._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Testimonial;
