import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
import ReadMoreReact from 'read-more-react';
// import PropTypes from 'prop-types';
class Advertisement extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <tr key={this.props.adv._id}>
      <td>{this.props.sequenceNo+1}</td>
        <td>{this.props.adv.advertisementName}</td>
        <td><ReadMoreReact text={this.props.adv.description.replace(/<(?:.|\n)*?>/gm, '')} min={1}  ideal={100} max={200} /></td>
        <td>{this.props.adv.redirectURL}</td>   
        <td><img src={'assets/uploads/AdvertisementImage/'+this.props.adv.image} className="avatar" alt=""/></td>
        <td>
          <Badge className="mousePointer" onClick={this.props.changeStatus.bind(this, this.props.adv)} color={(this.props.adv.status == '1')?'danger':'success'}>
            {(this.props.adv.status == '1')?'Inctive':'Active'}
          </Badge>
        </td>
        <td>
          <Link to={'/advertisement/edit/' + this.props.adv._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          <Link to={'/advertisement/view/' + this.props.adv._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
          <i className="fa fa-trash fa-md mousePointer"  onClick={this.props.onDeleteAdv.bind(this, this.props.adv._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Advertisement;
