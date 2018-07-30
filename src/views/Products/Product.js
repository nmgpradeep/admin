import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
// import PropTypes from 'prop-types';

class Product extends Component {
  
Capitalize(str){	
	return str.charAt(0).toUpperCase() + str.slice(1);
}
  render() {
    return (    
      <tr key={this.props.product._id}>		
        <td>{this.props.sequenceNumber}</td>
        <td>{this.props.product.productName}</td>
        <td>{this.props.product.description}</td>
        <td>{(this.props.product.category)? this.props.product.category.title:''}</td>  
        <td>{(this.props.product.user)?this.props.product.user[0].firstName+' '+this.props.product.user[0].lastName:''}</td>
        <td>{(this.props.product.size)?this.props.product.size.size:''}</td>
        <td>{this.props.product.color}</td>  
        <td>{(this.props.product.brand)?this.props.product.brand.brandName:''}</td>
        <td>{this.props.product.productAge}</td>     
        <td>{this.props.product.productImage}</td>   
        <td>
          <Badge onClick={this.props.changeStatus.bind(this, this.props.product)} color={(this.props.product.productStatus === '1')?'success':'danger'}>
            {(this.props.product.productStatus === '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>
          <Link to={'/products/edit/' + this.props.product._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          <Link to={'/products/view/' + this.props.product._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
          <i className="fa fa-trash fa-md"  onClick={this.props.onDeleteProduct.bind(this, this.props.product._id)} ></i>&nbsp;
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Product;
