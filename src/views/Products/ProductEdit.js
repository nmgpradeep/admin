import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Category from './Category';
import User from './User';
import UserSelectBox from '../SelectBox/UserSelectBox/UserSelectBox'
import CategorySelectBox from '../SelectBox/CategorySelectBox/CategorySelectBox'
import BrandSelectBox from '../SelectBox/BrandSelectBox/BrandSelectBox'
import SizeSelectBox from '../SelectBox/SizeSelectBox/SizeSelectBox'

import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6

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
    this.color = React.createRef();
    this.productAge = React.createRef();
    this.productImages = React.createRef();
    this.category = React.createRef();
    this.user = React.createRef();
    this.author = React.createRef();
    this.condition = React.createRef();
    this.brand = React.createRef();
    this.size = React.createRef();
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

      }
    };
    this.categoryhandleContentChange = this.categoryhandleContentChange.bind(this)
  }

    handleCategory = (category) => {
	   this.setState({category: category});
    }
    
    handleUser = (user) => {
	  this.setState({user: user});
    }

    handleBrand = (brand) => {
       this.setState({brand: brand});
    }
    
    handleSize = (size) => {
	  this.setState({size: size});
    }


	
    categoryhandleContentChange(value) {			
        this.setState({onDefaultValuesSet:value})    
    } 
  
    cancelHandler(){
       this.props.history.push("/products");
    }  
    fileChangedHandler = (event) => {
	  this.setState({selectedFile: event.target.files[0]})
	   console.log('ddddddddd',this.state.selectedFile);

   }
   
   conditionsChange = (value) => {
        this.setState({conditionValue: value.target.value});
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
		const data = new FD();
		data.append('data', this.state.editProduct);
		data.append('_id', this.state.editProduct._id);
		data.append('productName', this.productName.value);
		data.append('description', this.description.value);
		data.append('productCategory',(this.state.category)?this.state.category:this.state.editProduct.productCategory._id);
		data.append('productAge',this.productAge.value);
		data.append('userId',(this.state.user)?this.state.user:this.state.editProduct.userId._id);
		data.append('size', this.state.size?this.state.size:this.state.editProduct.size._id);
		data.append('condition', this.state.conditionValue);
		data.append('color', this.color.value);
		data.append('brand', (this.state.brand)?this.state.brand:this.state.editProduct.brand._id);
		if(this.state.selectedFile){
		    data.append('productImages', this.state.selectedFile);
		    //data.append('productImages', this.state.selectedFile, this.state.selectedFile.name);
		} else {
			data.append('productImages', this.state.editProduct.productImages);
	    }

	    axios.put('/product/updateProduct', data).then(result => {
			console.log('ddd',data);
            if(result.data.code == 200){
               this.props.history.push("/products");
           }

        });

      }
   }

  componentDidMount() {
      axios.get('/product/viewProduct/' + this.state.productId).then(result => {
      if(result.data.code === 200) {
        this.setState({editProduct: result.data.result});       
        this.productName.value = result.data.result.productName;
        this.description.value = result.data.result.description;
        if(result.data.result.productCategory && result.data.result.productCategory.length > 0){
			this.category.value = result.data.result.productCategory._id;
		}
        if(result.data.result.brand && result.data.result.brand.length > 0){
			this.brand.value = result.data.result.brand._id;
		}

        if(result.data.result.size && result.data.result.size.length > 0){
			this.size.value = result.data.result.size._id;
		}
        if(result.data.result.userId && result.data.result.userId.length > 0){
			this.author.value = result.data.result.userId._id;
		}     
        this.color.value = result.data.result.color;        
		this.productAge.value = result.data.result.productAge;        
        this.setState({productImages: result.data.result.productImages});       
       }      
      })     

       axios.get('/category/allCategories').then(result => {
        if(result.data.code === 200){
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
		    optionTemplate = conditionsList.map(v => (<option value={v.id}>{v.name}</option>));
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
			<Form noValidate action="" method="post" noValidate encType="multipart/form-data" className="form-horizontal">
			<Row>
			<Col xs="4" sm="12">
			<FormGroup>
			<Label htmlFor="company">Name</Label>
			  <Input type="text" innerRef={input => (this.productName = input)} placeholder="Product Name" /> </FormGroup>
			</Col>
			</Row>
			<FormGroup>
			<Label htmlFor="description">Description</Label>
			  <Input type="textarea" innerRef = {input => (this.description = input)} placeholder="Description" required/>
			</FormGroup>
			<FormGroup>
			<Label htmlFor="category">Category</Label> <br/> 
			<CategorySelectBox onSelectCategory={this.handleCategory} value={this.state.editProduct.productCategory?this.state.editProduct.productCategory._id:""}/>
			</FormGroup>
			<FormGroup>
			<Label htmlFor="user">User</Label>
			<UserSelectBox onSelectUser={this.handleUser} value={this.state.editProduct.userId?this.state.editProduct.userId._id:""}/>    
			</FormGroup>
			<FormGroup>
			<Label htmlFor="size">Size</Label>                  
			<SizeSelectBox onSelectSize={this.handleSize}  reference={(size)=> this.size = size} value={(this.state.editProduct.size)?this.state.editProduct.size._id:''}/>

			</FormGroup>
			<FormGroup>
			<Label htmlFor="color">Color</Label>
			<Input type="text" innerRef={input => (this.color = input)} placeholder="Color" />
			</FormGroup>
			<FormGroup>
			<Label htmlFor="brand">Brand</Label>
			  <BrandSelectBox onSelectBrand={this.handleBrand} reference={(brand)=> this.brand = brand} value={(this.state.editProduct.brand)?this.state.editProduct.brand._id:''}/>
			</FormGroup>
			<FormGroup>
			<Label htmlFor="brand">Conditions</Label>
			<select id="select" reference={(condition)=> this.condition = condition} value={this.state.editProduct.condition} className="form-control" onChange={this.conditionsChange}>
			{optionTemplate}
			</select>
			</FormGroup>
			<FormGroup>
			<Label htmlFor="age">Age Of Item</Label>
			<Input type="text" innerRef={input => (this.productAge = input)} placeholder="Age" />
			</FormGroup>
			<FormGroup>
			<Label htmlFor="lastname">Product Image</Label>
			<Input type="file" innerRef={input => (this.productImages = input)} onChange={this.fileChangedHandler} placeholder="Product Image" />
			<img src={'assets/uploads/Products/'+this.state.productImages} width="60"/>
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
