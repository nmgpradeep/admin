import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Category from './Category';
import User from './User';
//import Category from './User';
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
class ProductAdd extends Component {
  constructor(props){
    super(props);
    this.productName = React.createRef();
    this.description = React.createRef();
    this.parent = React.createRef();
    this.status = React.createRef();
    this.state = {
       addProduct: {},
       Categories: [],
       Users: [],
       categoryValue: '',
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
        }
      }
    };
    this.categoryhandleContentChange = this.categoryhandleContentChange.bind(this)
  }
  
  categoryhandleContentChange(value) {			
    this.setState({categoryValue:value })    
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
        addProduct.size = this.size.value;
        addProduct.color = this.color.value;
        addProduct.brand = this.brand.value;       
        addProduct.productAge = this.productAge.value;
        addProduct.userId = '5b236b4ad73fe224efedae86';
        addProduct.productCategory = '5b3ca9c23d43f138959e3224';  
        
        axios.post('/product/create', addProduct).then(result => {
          if(result.data.code == '200'){
            this.props.history.push("/products");
          }
        });
      }
  }
  
   //~ categoryhandleContentChange(value) {	
	  //~ alert('asdf');
	  //~ console.log('<<<<<<<<<<<<<<<<<<<<<<<content value',value);    
      //~ this.setState({ categoryValue: value });
  //~ }
  
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/category/categories').then(result => {
        if(result.data.code == '200'){
          this.setState({
            categories: result.data.result,            
          });
        }
        console.log(this.state.categories);
      })
      axios.get('/user/users/1' ).then(result => {
	  console.log('<<<<<<<<<<<<<<<<<<<<usersssss>',result);
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
                <strong>Add Product</strong>
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
export default ProductAdd;
