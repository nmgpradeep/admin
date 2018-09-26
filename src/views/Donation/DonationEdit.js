import React,{ Component }from 'react'
import { Link } from "react-router-dom";
import axios from 'axios'
import UserSelectBox from '../SelectBox/UserSelectBox/UserSelectBox'
import CategorySelectBox from '../SelectBox/CategorySelectBox/CategorySelectBox'
import BrandSelectBox from '../SelectBox/BrandSelectBox/BrandSelectBox'
import SizeSelectBox from '../SelectBox/SizeSelectBox/SizeSelectBox'

import {
  Button,  
  Card,
  CardBody,  
  CardHeader,
  Col,  
  Form,
  FormGroup, 
  Input,  
  Label,
  Row,
} from 'reactstrap';

var FD = require('form-data');
var fs = require('fs');
// import PropTypes from 'prop-types';
class DonationEdit extends Component {
  constructor(props){
    super(props);
    this.productName = React.createRef();
    this.description = React.createRef();
    this.productCategory = React.createRef();
    this.author = React.createRef();
    this.size = React.createRef();
    this.color = React.createRef();
    this.brand = React.createRef();
    this.condition = React.createRef();
    this.productAge = React.createRef();
    this.productImage = React.createRef();

    let donationId = this.props.match.params.id;
    this.state = {
      editDonation: {},
      condition :[],
      conditionsValue: '', 
      donationId: donationId,
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
    };
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
  
    fileChangedHandler = (event) => {
	  this.setState({selectedFile: event.target.files[0]})	  
    }
    
    cancelHandler(){
      this.props.history.push("/donations");
   }
  
    conditionsChange = (value) => {	 
        this.setState({conditionValue: value.target.value});
    }
   
  submitHandler(e){
      e.preventDefault();
      let formSubmitFlag = true;
      for (let field in this.state.validation) {
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
		data.append('data', this.state.editDonation);
		data.append('_id', this.state.editDonation._id);
		data.append('productName', this.productName.value);
		data.append('description', this.description.value);
		//data.append('productCategory',this.category.value);
		data.append('productCategory',(this.state.category)?this.state.category:this.state.editDonation.productCategory._id);
		//data.append('userId',this.author.value);
		data.append('userId',(this.state.user)?this.state.user:this.state.editDonation.userId._id);
		data.append('size', this.state.size?this.state.size:this.state.editDonation.size._id);		
		data.append('condition', this.state.conditionValue);
		data.append('color', this.color.value);
		data.append('brand', (this.state.brand)?this.state.brand:this.state.editDonation.brand._id);
		data.append('productAge', this.productAge.value);
		if(this.state.selectedFile){
		   // data.append('productImage', this.state.selectedFile, this.state.selectedFile.name);
		    data.append('productImage', this.state.selectedFile);
		} else {
			data.append('productImage', this.state.editDonation.productImage); 
	    }
            axios.put('/donation/updateDonation', data).then(result => {
             if(result.data.code === 200){
               this.props.history.push("/donations");
           }
        }); 
      }
    }
      
     conditionsChange = (value) => {	   
         this.setState({conditionValue: value.target.value});
     } 
   
    componentDidMount() {   
      axios.get('/donation/viewDonation/' + this.state.donationId).then(result => {  
		  console.log('zzzzzzzzzz',result);	 
         if(result.data.code === 200){	
			 	   
            this.setState({ editDonation: result.data.result});           
            this.productName.value = result.data.result.productName;
            this.description.value = result.data.result.description;            
            //~ this.category.value = result.data.result.productCategory?result.data.result.productCategory._id:'';
            //~ this.brand.value = result.data.result.brand?result.data.result.brand._id:"";
            //~ this.size.value = result.data.result.size?result.data.result.size._id:"";
            this.color.value = result.data.result.color;
            this.productAge.value = result.data.result.productAge; 
            //console.log('ddddddd',result.data.result);
                   
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
		    optionTemplate = conditionsList.map(v => (<option value={v.id}>{v.name}</option>));
       }
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>           
              <CardHeader>
                <strong>Donation</strong>
                <small> Edit</small>
                <Link to="/donations" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
               <Form action="" method="post" noValidate encType="multipart/form-data" className="form-horizontal">
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label >Product Name</Label>
                      <Input type="text" innerRef={input => (this.productName = input)}  placeholder="Product name" /></FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">Description</Label>
                       <Input type="textarea" innerRef = {input => (this.description = input)} placeholder="Description" required/>
                    </FormGroup>
                    </Col>
                     <Col xs="4" sm="12">
					   <FormGroup>						
						<Label htmlFor="author">User</Label>									  
						 <UserSelectBox onSelectUser={this.handleUser} value={this.state.editDonation.userId?this.state.editDonation.userId._id:""}/>
					  </FormGroup>
                  </Col>
                     <Col xs="4" sm="12">
					   <FormGroup>						
						  <Label htmlFor="author">Category</Label><br />									  
						   <CategorySelectBox onSelectCategory={this.handleCategory}  value={this.state.editDonation.productCategory?this.state.editDonation.productCategory._id:""}/>	
					  </FormGroup>
                  </Col>
                   <Col xs="4" sm="12">
					  <FormGroup>
						  <Label htmlFor="size">Size</Label>
						  <SizeSelectBox onSelectSize={this.handleSize} reference={(size)=> this.size = size}  value={(this.state.editDonation.size)?this.state.editDonation.size._id:''}/>
						</FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
						<FormGroup>
						  <Label htmlFor="color">Color</Label>
						  <Input type="text" innerRef={input => (this.color = input)} placeholder="color" />
						</FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
						<FormGroup>
						  <Label htmlFor="brand">Brand</Label>
						 <BrandSelectBox onSelectBrand={this.handleBrand} reference={(brand)=> this.brand = brand}  value={(this.state.editDonation.brand)?this.state.editDonation.brand._id:''}/>
						</FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
						<FormGroup>
						 <Label htmlFor="brand">Image</Label>                  
						  <Input type="file" innerRef={input => (this.productImage = input)} onChange={this.fileChangedHandler} placeholder="Banner Image" /> 	
						  <img src={'assets/uploads/donationImage/'+this.state.editDonation.productImage} width="60"/>
					   </FormGroup>
                   </Col>
                   <Col xs="4" sm="12">				
                      <FormGroup>
						 <Label htmlFor="brand">Conditions</Label> 
                          <select id="select" reference={(condition)=> this.condition = condition} value={this.state.editDonation.condition} className="form-control" onChange={this.conditionsChange}>
						   {optionTemplate}
					     </select> 		  
                      </FormGroup>
                   </Col>
                   <Col xs="4" sm="12">
						<FormGroup>
						  <Label htmlFor="productAge">Age Of Item</Label>
						  <Input type="text" innerRef={input => (this.productAge = input)} placeholder="Age" />
						</FormGroup>
                    </Col>
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
export default DonationEdit;
