import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import ReadMoreReact from 'read-more-react';
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
		<td>
		<ReadMoreReact text={this.props.product.description.replace(/<(?:.|\n)*?>/gm, '')} min={1}  ideal={100} max={200} />
		</td>
		<td>{(this.props.product.user[0])?this.props.product.user[0].firstName:''}</td>        
		<td>{this.props.product.productAge}</td>  
		<td><img src={'assets/uploads/Products/'+this.props.product.productImages} width="40" alt=""/></td>
		<td>
		<Badge className="mousePointer" onClick={this.props.changeStatus.bind(this, this.props.product)} color={(this.props.product.productStatus === '1')?'success':'danger'}>
		   {(this.props.product.productStatus === '1')?'Active':'Inctive'}
		</Badge>
		</td>
		<td>
		<Link to={'/products/edit/' + this.props.product._id}><i className="fa fa-edit fa-md"></i>&nbsp;</Link>
		<Link to={'/products/view/' + this.props.product._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
		<i className="fa fa-trash fa-md mousePointer"  onClick={this.props.onDeleteProduct.bind(this, this.props.product._id)} ></i>&nbsp;
		</td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Product;
