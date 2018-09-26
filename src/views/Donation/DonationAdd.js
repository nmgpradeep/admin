import React,{ Component }from 'react'
import axios from 'axios'
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

class DonationAdd extends Component {
  constructor(props){
    super(props)
    this.productName = React.createRef(),
    this.description = React.createRef(),
    this.productCategory = React.createRef(),
    this.userId = React.createRef(),
    this.condition = React.createRef(),
    this.size = React.createRef(),
    this.color = React.createRef(),
    this.brand = React.createRef(),
    this.productAge = React.createRef(),
    this.productImage = React.createRef(),
    
    this.state = {
      donationadd: {},
      Categories: [],
      condition :[],
      conditionsValue: '',    
      validation:{
        productName: {
          rules: {
            notEmpty: {
              message: 'Product name can\'t be left blank',
              valid: false

            }
          },
          valid: null,
          message: ''
        },
        description:{
          rules: {
            notEmpty: {
              message: 'Product description can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        size: {
          rules: {
            notEmpty: {
              message: 'size can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        color: {
          rules: {
            notEmpty: {
              message: 'Please provide a color for the product',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        brand: {
            rules: {
              notEmpty: {
                message: 'brand can\'t be left blank',
                valid: false
              }
            },
            valid: null,
            message: ''
          },
          productAge: {
           rules: {
              notEmpty: {
               message: 'Age can\'t be left blank',
                valid: false
              }
            },
            valid: null,
            message: ''
          },
      }
    } 
  }
  
  cancelHandler(){
    this.props.history.push("/donations");
  }
  
  fileChangedHandler = (event) => {
	this.setState({selectedFile: event.target.files[0]})
  }
  
  handleUser = (user) => {	 
      this.setState({user: user}); 
      this.setState({selectedValue: user});
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
    
  componentDidMount() {    
       axios.get('/donation/getConstant').then(result => {
           this.setState({conditions: result.data.result });           
       });
  }   
  conditionsChange = (value) => {	   
         this.setState({conditionValue: value.target.value});
  } 

  submitHandler(e){
   e.preventDefault();
      let formSubmitFlag = true;
      for(let field in this.state.validation){
        let lastValidFieldFlag = true;
        let addDonation = this.state.validation;
        addDonation[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              break;
          }
        }
        this.setState({ validation: addDonation});
    }
    if(formSubmitFlag){
		const data = new FD();
		data.append('productName', this.productName.value);
		data.append('description', this.description.value);
		//data.append('productCategory',this.state.category);
		data.append('productCategory','5b584fa7116a023e021c60c9');
		data.append('userId', this.state.user);
		data.append('size', this.state.size);
		data.append('condition', this.state.conditionValue);
		data.append('color', this.color.value);
		data.append('brand', this.state.brand)
		data.append('productAge', this.productAge.value);
		if(this.state.selectedFile)
		 data.append('productImage', this.state.selectedFile);					
		else
		data.append('productImage','NULL');	
		data.append('condition', this.state.conditionValue);		
        axios.post('/donation/donate', data).then(result => {
			console.log('rrrrrrrrrrr',result);
          if(result.data.code === 200){
            this.props.history.push("/donations");
          }
        });     
    }
  }

    render(){
	  let optionTemplate;
	    if(this.state.conditions){
			let conditionsList = this.state.conditions;
		    optionTemplate = conditionsList.map(v => (<option value={v.id}>{v.name}</option>));
   }	  
    return (
      <div>
        <Card>
             <CardHeader>
                <strong>New Donation Form</strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" noValidate encType="multipart/form-data" className="form-horizontal">
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="advertisementName">Product Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.productName.valid === false} innerRef={input => (this.productName = input)} placeholder="Product Name" />
                      <FormFeedback invalid={this.state.validation.productName.valid === false}>{this.state.validation.productName.message}</FormFeedback>
                  </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="description">Description</Label>
                    </Col>
                    <Col xs="12" md="9">   
                       <Input type="textarea" innerRef = {input => (this.description = input)} placeholder="Description" required/>  
                    </Col>
                  </FormGroup>                 
                 <FormGroup row>
                  <Col md="3">
                      <Label htmlFor="author">Author</Label>
                    </Col>
                 <Col md="3">
                  <UserSelectBox  onSelectUser={this.handleUser}/>
                  </Col>
                </FormGroup>
                 <FormGroup row>
                  <Col md="3">
                      <Label htmlFor="author">Category</Label>
                    </Col>
                 <Col md="9">
                    <CategorySelectBox onSelectCategory={this.handleCategory}/>                 
                  </Col>
                </FormGroup>
                <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="Size">Size</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <SizeSelectBox onSelectSize={this.handleSize}/>
                  </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="color">Color</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.color.valid === false} innerRef={input => (this.color = input)} placeholder="Color" />
                      <FormFeedback invalid={this.state.validation.color.valid === false}>{this.state.validation.color.message}</FormFeedback>                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="brand">Brand</Label>
                    </Col>
                    <Col xs="12" md="9">
                       <BrandSelectBox onSelectBrand={this.handleBrand}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="productAge">Age Of Item</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.productAge.valid === false} innerRef={input => (this.productAge = input)} placeholder="Age" />
                      <FormFeedback invalid={this.state.validation.productAge.valid === false}>{this.state.validation.productAge.message} </FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">				
                      <Label htmlFor="lastname">Image</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="file" innerRef={input => (this.productImage = input)} onChange={this.fileChangedHandler} placeholder="Banner Image" /> 						  
                   </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">				
                      <Label htmlFor="lastname">Conditions</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <select id="select" innerRef={input => (this.condition = input)} className="form-control" onChange={this.conditionsChange}>
						{optionTemplate}
					  </select> 		  
                   </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="Status">Status</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <select innerRef={input => (this.status = input)} id="status" className="form-control" >
					  <option value="1">Active</option>
					  <option value="0">Inactive</option>					
                  </select>
                    </Col>
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
      </div>
    )
  }
}

export default DonationAdd;
