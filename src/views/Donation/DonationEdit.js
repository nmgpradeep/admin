import React,{ Component }from 'react'
import { Link } from "react-router-dom";
import axios from 'axios'
import UserSelectBox from '../SelectBox/UserSelectBox/UserSelectBox'
import CategorySelectBox from '../SelectBox/CategorySelectBox/CategorySelectBox'
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
     // author : '',
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
       this.category.current = category;
    }
    handleUser = (user) => {
	  this.author.current = user;
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
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  addDonation[field].valid = false;
                  addDonation[field].message = addDonation[field].rules[fieldCheck].message;
               }
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
		data.append('productCategory',this.category.value);
		data.append('userId',this.author.value);
		data.append('size', this.size.value);
		data.append('condition', this.state.conditionValue);
		data.append('color', this.color.value);
		data.append('brand', this.brand.value);
		data.append('productAge', this.productAge.value);
		if(this.state.selectedFile){
		    data.append('productImage', this.state.selectedFile, this.state.selectedFile.name);
		} else {
			data.append('productImage', this.state.editDonation.productImage); 
	    }
        axios.put('/donation/updateDonation', data).then(result => {
			console.log('resultImages ',result);
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
         if(result.data.code === 200){
           this.setState({ editDonation: result.data.result});           
           this.productName.value = result.data.result.productName;
           this.description.value = result.data.result.description;
           this.size.value = result.data.result.size;
           this.author.value = result.data.result.userId._id; 
           this.category.value = result.data.result.productCategory._id;
           this.color.value = result.data.result.color;
           this.brand.value = result.data.result.brand;
           this.productAge.value = result.data.result.productAge;                   
           //this.productImage.value = result.data.result.productImage;
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
                      <Input type="text" innerRef={input => (this.productName = input)}  placeholder="Product name" />  </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">Description</Label>
                      <Input type="text" innerRef={input => (this.description = input)} placeholder="Description" />
                    </FormGroup>
                    </Col>
                     <Col xs="4" sm="12">
					   <FormGroup>						
						  <Label htmlFor="author">User</Label>									  
						 <UserSelectBox onSelectUser={this.handleUser} reference={(author)=> this.author = author} value={this.state.editDonation.author}/>						
					  </FormGroup>
                  </Col>
                     <Col xs="4" sm="12">
					   <FormGroup>						
						  <Label htmlFor="author">Category</Label>									  
						   <CategorySelectBox onSelectCategory={this.handleCategory} reference={(category)=> this.category = category} value={this.state.editDonation.category}/>	
					  </FormGroup>
                  </Col>
                   <Col xs="4" sm="12">
						<FormGroup>
						  <Label htmlFor="size">Size</Label>
						  <Input type="text" innerRef={input => (this.size = input)} placeholder="Size" />
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
						  <Input type="text" innerRef={input => (this.brand = input)} placeholder="Brand" />
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
