import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
// import PropTypes from 'prop-types';

class Product extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <tr key={this.props.product._id}>
		
        <td>{this.props.product.productName}</td>
        <td>{this.props.product.description}</td>
        <td>{this.props.product.productCategory}</td>  
        <td>{this.props.product.userId}</td>
        <td>{this.props.product.size}</td>
        <td>{this.props.product.color}</td>  
        <td>{this.props.product.brand}</td>
        <td>{this.props.product.productAge}</td>        
        <td>
          <Badge onClick={this.props.changeStatus.bind(this, this.props.product)} color={(this.props.product.productStatus === '1')?'success':'danger'}>
            {(this.props.product.productStatus === '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>
          <Link to={'/product/edit/' + this.props.product._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
          <Link to={'/product/view/' + this.props.product._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
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
