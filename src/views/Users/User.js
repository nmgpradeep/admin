import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
// import PropTypes from 'prop-types';
class User extends Component {

  Capitalize(str){
	return str.charAt(0).toUpperCase() + str.slice(1);
}
  render() {
    return (
      <tr key={this.props.user._id}>
        <td>{this.props.sequenceNumber+1}</td>
        <td>{this.Capitalize(this.props.user.firstName)} {this.Capitalize(this.props.user.middleName)} {this.Capitalize(this.props.user.lastName)}</td>
        <td>{this.props.user.userName}</td>
        <td>{this.props.user.email}</td>
        <td>{Moment(this.props.user.createdAt).format('d MMM YYYY')}</td>
        <td><img src={'assets/uploads/ProfilePic/'+this.props.user.profilePic} className="avatar"/></td>
        <td>
          <Badge onClick={this.props.changeStatus.bind(this, this.props.user)} color= {(this.props.user.userStatus === '1')?'success':'danger'}>
            {(this.props.user.userStatus === '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>
          <Link to={'/users/edit/' + this.props.user._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          <Link to={'/users/view/' + this.props.user._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
          <i className="fa fa-trash fa-md"  onClick={this.props.onDeleteUser.bind(this, this.props.user._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default User;
