import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
// import PropTypes from 'prop-types';

class Category extends Component {
  constructor(props){
    super(props);  
     this.state = {  };      
  }
  render() {
    return (		
		   <option value={this.props.category._id}>{this.props.category.categoryName}</option>					
       
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Category;
