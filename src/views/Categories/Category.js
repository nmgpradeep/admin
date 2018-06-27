import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
// import PropTypes from 'prop-types';

class Category extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <tr key={this.props.category._id}>
		
        <td>{this.props.category.categoryName}</td>
        <td>{this.props.category.description}</td>
        <td>{this.props.category.parent}</td>       
        <td>
          <Badge onClick={this.props.changeStatus.bind(this, this.props.category)} color={(this.props.category.categoryStatus === '1')?'success':'danger'}>
            {(this.props.category.categoryStatus === '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>
          <Link to={'/category/edit/' + this.props.category._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          <Link to={'/category/view/' + this.props.category._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
          <i className="fa fa-trash fa-md"  onClick={this.props.onDeleteCategory.bind(this, this.props.category._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Category;
