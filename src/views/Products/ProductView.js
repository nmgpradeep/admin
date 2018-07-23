import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
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
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');     
     axios.get('/product/viewProduct/' + this.state.productId).then(result => {
		 console.log('view products',result);
         if(result.data.code == '200'){
          //localStorage.setItem('jwtToken', result.data.result.accessToken);
          this.setState({ viewProducts: result.data.result});
        }
      })
      .catch((error) => {
        if(error.status === 401) {
          //this.props.history.push("/login");
        }
      });
  }
  render() {
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
                      <Input type="text" value={this.state.viewProducts.category} />
                    </FormGroup>
                  </Col>
                </Row>               
                <FormGroup>
                  <Label htmlFor="email">Size</Label>
                  <Input type="text" value={this.state.viewProducts.size} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Color</Label>
                  <Input type="text" value={this.state.viewProducts.color} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Brand</Label>
                  <Input type="text" value={this.state.viewProducts.brand} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Age Of Item</Label>
                  <Input type="text" value={this.state.viewProducts.productAge} />
                </FormGroup>
                <FormGroup>
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
