import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
// import PropTypes from 'prop-types';
class State extends Component {
  constructor(props){
    super(props);
  }


  render() {
    console.log(this.props)
    return (
      <tr key={this.props.state._id}>
        <td>{this.props.state.country.countryName}</td>
        <td>{this.props.state.stateName}</td>
        {/* <td>{this.Capitalize(this.props.testimonial.author.firstName)} {this.Capitalize(this.props.testimonial.author.lastName)}</td>    */}
        <td>
          <Badge onClick={this.props.changeStatus.bind(this, this.props.state)} color={(this.props.state.status == '1')?'success':'danger'}>
            {(this.props.state.status == '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>
          <Link to={'/state/edit/' + this.props.state._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          {/* <Link to={'/testimonial/view/' + this.props.testimonial._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link> */}
          <i className="fa fa-trash fa-md"  onClick={this.props.onDeleteState.bind(this, this.props.state._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default State;
