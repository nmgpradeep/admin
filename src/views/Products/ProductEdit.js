import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Category from './Category';
import User from './User';
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

import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
var FD = require('form-data');
var fs = require('fs');

// import PropTypes from 'prop-types';
class ProductEdit extends Component {
  constructor(props){
    super(props);
    this.productName = React.createRef();
    this.description =React.createRef();
    this.parent = React.createRef();
    this.status = React.createRef();  
    this.size = React.createRef();
    this.color = React.createRef();
    this.brand = React.createRef();       
    this.productAge = React.createRef();
    let productId = this.props.match.params.id;
    this.state = {
      editProduct: {},
      productId: productId,
      Categories: [],
      Users: [],
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
        },
        description:{
          rules: {
            notEmpty: {
              message: 'Description field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        }
      }
    };
    this.categoryhandleContentChange = this.categoryhandleContentChange.bind(this)
  }
  
   categoryhandleContentChange(value) {			
      this.setState({categories:value })    
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
                  addProduct[field].message = addProduct[field].rules[fieldCheck].message;

               }
              break;
             case 'minLength':
              if(lastValidFieldFlag === true && this[field].value.length < parseInt(this.state.validation[field].rules[fieldCheck].length)){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addProduct[field].valid = false;
                addProduct[field].message = addProduct[field].rules[fieldCheck].message;
              }
              break;
            case 'matchWith':
              if(lastValidFieldFlag === true && this[field].value !== this[this.state.validation[field].rules[fieldCheck].matchWithField].value){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addProduct[field].valid = false;
                addProduct[field].message = addProduct[field].rules[fieldCheck].message;
              }
              break;
           }
        }
        this.setState({ validation: addProduct});
      }

      if(formSubmitFlag){
        let editProduct = this.state.editProduct;
        editProduct.productName = this.productName.value;
        editProduct.description = this.description.value;
        editProduct.size = this.size.value;
        editProduct.color = this.color.value;
        editProduct.brand = this.brand.value;       
        editProduct.productAge = this.productAge.value;        
        axios.put('/product/updateProduct', editProduct).then(result => {
          if(result.data.code == '200'){
            this.props.history.push("/products");
          }
        });
      }
  }

  componentDidMount() {  	 
      axios.get('/product/viewProduct/' + this.state.productId).then(result => {
		  console.log('Results Data',result);       
      })     
       axios.get('/category/categories').then(result => {
        if(result.data.code == '200'){
          this.setState({
            categories: result.data.result,            
          });
        }        
      })
      
      axios.get('/user/users/1' ).then(result => {	 
      if(result.data.code ===200){
        this.setState({
          users: result.data.result,         
        });
        }
        console.log(this.state.users);
      })
      .catch((error) => {
        if(error.status === 401) {
          this.props.history.push("/login");
        }
      });

  }
  
  render() {
	   let categories,users;
       if(this.state.categories){
          let categoryList = this.state.categories;
          categories = categoryList.map(category => <Category key={category._id}  category={category}/>);
       }
       if(this.state.users){
          let userList = this.state.users;
          users = userList.map(user => <User key={user._id}  user={user}/>);
       }
	  
	  
   return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Edit Product</strong>
                 <Button onClick={()=>this.cancelHandler()} color="primary" className="btn btn-success btn-sm pull-right">Back</Button>
              </CardHeader>
              <CardBody>
              <Form noValidate>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Name</Label>
                      <Input type="text" invalid={this.state.validation.productName.valid === false} innerRef={input => (this.productName = input)} placeholder="Product Name" />
                      <FormFeedback invalid={this.state.validation.productName.valid === false}>{this.state.validation.productName.message}</FormFeedback>
                    </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="description">Description</Label>
                    <Input type="textarea" placeholder="Description" required/>
                     
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="category">Category</Label>
                   <select innerRef={input => (this.category = input)} id="select"  class="form-control"  onChange={this.categoryhandleContentChange}>	                   
                    {categories}
                    </select>
                </FormGroup>
                 <FormGroup>
                  <Label htmlFor="user">User</Label>
                   <select innerRef={input => (this.user = input)} id="select" class="form-control" >
					 {users}
                  </select>
                </FormGroup>
                 <FormGroup>
                  <Label htmlFor="size">Size</Label>
                  <Input type="text" innerRef={input => (this.size = input)} placeholder="Size" />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="color">Color</Label>
                  <Input type="text" innerRef={input => (this.color = input)} placeholder="Color" />
                </FormGroup>
                   <FormGroup>
                  <Label htmlFor="brand">Brand</Label>
                  <Input type="text" innerRef={input => (this.brand = input)} placeholder="Brand" />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="age">Age</Label>
                  <Input type="text" innerRef={input => (this.productAge = input)} placeholder="Age" />
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
export default ProductEdit;
