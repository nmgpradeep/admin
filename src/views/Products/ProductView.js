import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {
  Button,
  Card,
  CardBody, 
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import axios from 'axios';
// import PropTypes from 'prop-types';
class ProductView extends Component {
  constructor(props){
    super(props);
    this.state = {
      viewProducts: [],
      productId: this.props.match.params.id
    };
  }
  cancelHandler(){
    this.props.history.push("/products");
  }
  componentDidMount() {
      axios.get('/donation/getConstant').then(result => {
           this.setState({conditions: result.data.result});            
       });
      axios.get('/product/viewProduct/' + this.state.productId).then(result => {
		 console.log('view products',result);
         if(result.data.code === 200){
          this.setState({ viewProducts: result.data.result});
          this.condition.value = result.data.result.condition;
          this.productCategory.value = result.data.result.productCategory.title;
          this.userId.value = result.data.result.userId.firstName; 
          console.log('ddddddd',this.state.viewProducts);
        }
      })
      .catch((error) => {
        if(error.status === 401) {
          //this.props.history.push("/login");
        }
      });
  }
  render() {
	  let optionTemplate;
	    if(this.state.conditions){
			let conditionsList = this.state.conditions;
		    optionTemplate = conditionsList.map(v => (<option value={v.id}>{v.name}</option>));
       }
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
            <CardBody>
              <CardHeader>
                <strong>Product</strong>
                <small> View</small>
                 <Link to={'/products/edit/' + this.state.viewProducts._id} className="btn btn-success btn-sm pull-right">Edit Product</Link>
              </CardHeader>
                <FormGroup>
                  <Label htmlFor="id">ID</Label>
                  <Input type="text" value={this.state.viewProducts._id} />
                </FormGroup>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Name</Label>
                      <Input type="text" value={this.state.viewProducts.productName} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">Description</Label>
                      <Input type="text" value={this.state.viewProducts.description} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="lastname">Category</Label>
                      <Input type="text" value={this.state.viewProducts.productCategory?this.state.viewProducts.productCategory.title:""} />
                    </FormGroup>
                  </Col>
                </Row>   
                 <FormGroup>
                  <Label htmlFor="UserId">User Id</Label>                 
                  <Input type="text" value={this.state.viewProducts.userId?this.state.viewProducts.userId.firstName:''}/>
                </FormGroup>            
                <FormGroup>
                  <Label htmlFor="email">Size</Label>
                  <Input type="text" value={this.state.viewProducts.size?this.state.viewProducts.size.size:""} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Color</Label>
                  <Input type="text" value={this.state.viewProducts.color} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Brand</Label>
                  <Input type="text" value={this.state.viewProducts.brand?this.state.viewProducts.brand.brandName:""} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Age Of Item</Label>
                  <Input type="text" value={this.state.viewProducts.productAge} />
                </FormGroup>
                <FormGroup>
                <FormGroup>
                  <Label htmlFor="productAge">Condition</Label>
                   <select id="select"  value={this.state.viewProducts.condition} className="form-control" disabled>
					  {optionTemplate}
				   </select> 	
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="productAge">Image</Label>
                    <Col xs="12">
                    <img className="linkedin" src={'assets/uploads/Products/'+this.state.viewProducts.productImages} width="60"/> 
                     </Col>	
                </FormGroup>
                  <Label htmlFor="status">Status</Label>
                  <Input type="text" value={(this.state.viewProducts.productStatus === '1')?'Active':'Inactive'} />
                </FormGroup>
                <Row>
                  <Col xs="6" className="text-right">
                    <Button onClick={()=>this.cancelHandler()} color="primary" className="px-4">Cancel</Button>
                  </Col>
                  <Col xs="6">
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        </div>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default ProductView;
