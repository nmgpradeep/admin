import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
//import Moment from 'moment';
// import PropTypes from 'prop-types';
class City extends Component {
  //~ constructor(props){
    //~ super(props);
  //~ }
  render() {
    //console.log(this.props)
    return (
      <tr key={this.props.city._id}>
      <td>{this.props.sequenceNo+1}</td>
        <td>{(this.props.city.countrySelect)?this.props.city.countrySelect.countryName:''}</td>
        <td>{(this.props.city.stateSelect)?this.props.city.stateSelect.stateName:''}</td>
        <td>{this.props.city.cityName}</td>
        <td>
          <Badge className="mousePointer" onClick={this.props.changeStatus.bind(this, this.props.city)} color={(this.props.city.status == '1')?'danger':'success'}>
            {(this.props.city.status == '1')?'Inctive':'Active'}
          </Badge>
        </td>
        <td>
          <Link to={'/city/edit/' + this.props.city._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          <i className="fa fa-trash fa-md mousePointer"  onClick={this.props.onDeleteCity.bind(this, this.props.city._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
export default City;
