import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';
const port=5001;
axios.defaults.baseURL = window.location.protocol + '//' + window.location.hostname + ':' + port;
// import PropTypes from 'prop-types';
class ProductAdd extends Component {
  constructor(props){
    super(props);
    this.productName = React.createRef();
    this.description = React.createRef();
    this.parent = React.createRef();
    this.status = React.createRef();    
    this.state = {
      addProduct: {},
      validation:{
        productName:{
          rules: {
            notEmpty: {
              message: 'Product name field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        }        
      }
    };
  }
  cancelHandler(){
    this.props.history.push("/products");
  }
  submitHandler(e){
      e.preventDefault();
      let formSubmitFlag = true;
      for (let field in this.state.validation) {
        let lastValidFieldFlag = true;
        let addProduct = this.state.validation;
        addProduct[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  addProduct[field].valid = false;
                  addProduct[field].message = addProduct[field].addProduct[fieldCheck].message;

               }
              break;          
          }
        }
        this.setState({ validation: addProduct});
      }
      if(formSubmitFlag){
        let addProduct = this.state.addProduct;
        addProduct.productName = this.productName.value;
        addProduct.description = this.description.value;
        addProduct.parent = this.parent.value;
        addProduct.status = this.status.value;       
        axios.post('/product/create', addProduct).then(result => {
          if(result.data.code == '200'){
            this.props.history.push("/products");
          }
        });
      }
  }

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Add Product</strong>              
              </CardHeader>
              <CardBody>
              <Form noValidate>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Name</Label>
                      <Input type="text" invalid={this.state.validation.productName.valid === false} innerRef={input => (this.categoryName = input)} placeholder="Category Name" />

                      <FormFeedback invalid={this.state.validation.productName.valid === false}>{this.state.validation.categoryName.message}</FormFeedback>

                    </FormGroup>
                    </Col>                  
                </Row>
                <FormGroup>
                  <Label htmlFor="description">Description</Label>
                  <Input type="text" innerRef={input => (this.description = input)} placeholder="Description" />
                 
                </FormGroup>
               
                <FormGroup>
                  <Label htmlFor="parent">Parent</Label>
                   <select innerRef={input => (this.parent = input)} id="select" class="form-control" >
					  <option value="0">Please select</option>
					  <option value="1">Samsung</option>
					  <option value="2">Television</option>
					  <option value="3">Nokia</option>
                  </select>           
                 
                </FormGroup>
                
                 <FormGroup>
                  <Label htmlFor="status" >Status</Label>
                  <select innerRef={input => (this.status = input)} id="status" class="form-control" >
					  <option value="1">Active</option>
					  <option value="0">Inactive</option>					
                  </select>
                  
                 
                </FormGroup>
                
                <Row>
                  <Col xs="6" className="text-right">
                    <Button onClick={(e)=>this.submitHandler(e)} color="success" className="px-4">Submit</Button>
                  </Col>
                  <Col xs="6">
                    <Button onClick={()=>this.cancelHandler()} color="primary" className="px-4">Cancel</Button>
                  </Col>
                </Row>
                </Form>
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
export default ProductAdd;
