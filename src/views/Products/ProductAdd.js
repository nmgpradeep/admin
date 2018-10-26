import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Category from './Category';
import User from './User';
import UserSelectBox from '../SelectBox/UserSelectBox/UserSelectBox'
import CategorySelectBox from '../SelectBox/CategorySelectBox/CategorySelectBox'
import BrandSelectBox from '../SelectBox/BrandSelectBox/BrandSelectBox'
import SizeSelectBox from '../SelectBox/SizeSelectBox/SizeSelectBox'

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
    this.productImages = React.createRef();
    this.category = React.createRef();
    this.author = React.createRef();
    this.condition = React.createRef();
    this.brand = React.createRef();
    this.size = React.createRef();
    this.state = {
       addProduct: {},
       Categories: [],
       Users: [],
       categoryValue: '',
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

  fileChangedHandler = (event) => {
	  this.setState({selectedFile: event.target.files[0]})
  }

  handleUser = (user) => {
        this.setState({user: user});
  }

  handleCategory = (category) => {	 
     this.setState({category: category});
  }
  handleBrand = (brand) => {
        this.setState({brand: brand});
  }
  handleSize = (size) => {
        this.setState({size: size});
  }
  cancelHandler(){
    this.props.history.push("/products");
  }

   componentDidMount() {
       axios.get('/donation/getConstant').then(result => {
           this.setState({conditions: result.data.result});
       });
   }
   
   conditionsChange = (value) => {
       this.setState({conditionValue: value.target.value});
   }

  submitHandler(e){
      e.preventDefault();
      let formSubmitFlag = true;
      for(let field in this.state.validation) {
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
        console.log("state",this.state)
        const data = new FD();
        console.log('FORM DATA START', this.productName.value);
        data.append('productName', this.productName.value)
        data.append('description', this.description.value)
        data.append('size', this.state.size)
        data.append('color', this.color.value)
        data.append('brand', this.state.brand)
        data.append('productAge', this.productAge.value)
        data.append('condition', this.state.conditionValue);
        data.append('userId', this.state.user)
        data.append('productCategory', this.state.category)
        if(this.state.selectedFile){
		  data.append('productImages', this.state.selectedFile);
      	}
        console.log("data",data);
           axios.post('/product/create', data).then(result => {
			  if(result.data.code == 200){
               this.props.history.push("/products");
            }
        });
      }
  }

  componentDidMount(){
      axios.get('/category/allCategories').then(result => {
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
    })
    axios.get('/donation/getConstant').then(result => {
      this.setState({conditions: result.data.result});
     })
      .catch((error) => {
        if(error.status === 401) {
          this.props.history.push("/login");
        }
      });
  }


  render() {
	   let optionTemplate;
	    if(this.state.conditions){
			let conditionsList = this.state.conditions;
		    optionTemplate = conditionsList.map(v => (<option key={v.id} value={v.id}>{v.name}</option>));
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
                    <Input type="textarea" innerRef = {input => (this.description = input)} placeholder="Description" required/>
               </FormGroup>
                <FormGroup>
                  <Label htmlFor="category">Category</Label><br/>
                    <CategorySelectBox onSelectCategory={this.handleCategory}/>
                </FormGroup>
                 <FormGroup>
                  <Label htmlFor="user">User</Label>
					<UserSelectBox onSelectUser={this.handleUser}/>
                </FormGroup>
                 <FormGroup>
                  <Label htmlFor="size">Size</Label>
                  <SizeSelectBox onSelectSize={this.handleSize}/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="color">Color</Label>
                  <Input type="text" innerRef={input => (this.color = input)} placeholder="Color" />
                </FormGroup>
                   <FormGroup>
                 <Label htmlFor="brand">Brand</Label>
                  <BrandSelectBox onSelectBrand={this.handleBrand}/>
                </FormGroup>
                 <FormGroup>
                    <Label htmlFor="lastname">Conditions</Label>
                      <select id="select" innerRef={input => (this.condition = input)} className="form-control" onChange={this.conditionsChange}>
						{optionTemplate}
					  </select>
                 </FormGroup>
                <FormGroup>
                  <Label htmlFor="age">Age Of Item</Label>
                  <Input type="text" innerRef={input => (this.productAge = input)} placeholder="Age" />
                </FormGroup>
                  <FormGroup>
                      <Label htmlFor="lastname">Banner Image</Label>
                      <Input type="file" multiple="multiple" innerRef={input => (this.productImages = input)} onChange={this.fileChangedHandler} placeholder="Banner Image" />
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
