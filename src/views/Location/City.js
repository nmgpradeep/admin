import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
// import PropTypes from 'prop-types';
class City extends Component {
  constructor(props){
    super(props);
  }


  render() {
    console.log(this.props)
    return (
      <tr key={this.props.city._id}>
        <td>{this.props.city.countrySelect.countryName}</td>
        <td>{this.props.city.stateSelect.stateName}</td>
        <td>{this.props.city.cityName}</td>
        <td>
          <Badge onClick={this.props.changeStatus.bind(this, this.props.city)} color={(this.props.city.status == '1')?'success':'danger'}>
            {(this.props.city.status == '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>
          <Link to={'/city/edit/' + this.props.city._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          {/* <Link to={'/testimonial/view/' + this.props.testimonial._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link> */}
          <i className="fa fa-trash fa-md"  onClick={this.props.onDeleteCity.bind(this, this.props.city._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default City;
