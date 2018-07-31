import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
// import PropTypes from 'prop-types';
class Country extends Component {
  constructor(props){
    super(props);
  }

Capitalize(str){
	return str.charAt(0).toUpperCase() + str.slice(1);
}
  render() {
    return (
      <tr key={this.props.country._id}>
      <td>{this.props.sequenceNo+1}</td>
        <td>{this.props.country.countryName}</td>
        <td>{this.props.country.countryCode}</td>
        {/* <td>{this.Capitalize(this.props.testimonial.author.firstName)} {this.Capitalize(this.props.testimonial.author.lastName)}</td>    */}
        <td>
          <Badge onClick={this.props.changeStatus.bind(this, this.props.country)} color={(this.props.country.status == '1')?'danger':'success'}>
            {(this.props.country.status == '1')?'Inctive':'Active'}
          </Badge>
        </td>
        <td>
          <Link to={'/country/edit/' + this.props.country._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          <i className="fa fa-trash fa-md"  onClick={this.props.onDeleteCountry.bind(this, this.props.country._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Country;
