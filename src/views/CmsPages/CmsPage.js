import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
// import PropTypes from 'prop-types';
class CmsPage extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <tr key={this.props.cmsPage._id}>
      <td>{this.props.sequenceNo+1}</td>
        <td>{this.props.cmsPage.pageTitle}</td>
        <td>{this.props.cmsPage.pageHeading}</td>
        <td>{this.props.cmsPage.description.replace(/<(?:.|\n)*?>/gm, '')}</td>      
        <td>
          <Badge  onClick={this.props.changeStatus.bind(this, this.props.cmsPage)} color={(this.props.cmsPage.status === '1')?'success':'danger'}>
            {(this.props.cmsPage.status === '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>         
         <Link to={'/pages/edit/' + this.props.cmsPage._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>         
          <i className="fa fa-trash fa-md"  onClick={this.props.onDeleteCmsPage.bind(this, this.props.cmsPage._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
export default CmsPage;
