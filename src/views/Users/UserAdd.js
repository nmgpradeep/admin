import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import CountrySelectBox from '../SelectBox/CountrySelectBox/CountrySelectBox'
import StateAllSelectBox from '../SelectBox/StateSelectBox/StateAllSelectBox'
import CitySelectBox from '../SelectBox/CitySelectBox/CitySelectBox'
import SubscriptionSelectBox from '../SelectBox/SubscriptionSelectBox/SubscriptionSelectBox'

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
class UserAdd extends Component {
  constructor(props){
    super(props);
    this.firstName = React.createRef();
    this.middleName = React.createRef();
    this.lastName = React.createRef();
    this.username = React.createRef();
    this.password = React.createRef();    
    this.phoneNumber = React.createRef();
    this.dob = React.createRef();
    this.address = React.createRef();
    this.city = React.createRef();
    this.state = React.createRef();
    this.country = React.createRef();
    this.zipCode = React.createRef();
    this.subscriptionPlan = React.createRef();    
    this.confirmPassword = React.createRef();
    this.email = React.createRef();
    this.profilePic = React.createRef(),

    this.state = {
      addUser: {},
      validation:{
        firstName:{
          rules: {
            notEmpty: {
              message: 'First name field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        userName:{
          rules: {
            notEmpty: {
              message: 'Username field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        password:{
          rules: {
            notEmpty: {
              message: 'Password field can\'t be left blank',
              valid: false
            },
            minLength: {
              length: 6,
              message: 'Password field must have at least 6 characters long',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        confirmPassword:{
          rules: {
            notEmpty: {
              message: 'Confirm password field can\'t be left blank',
              valid: false
            },
            matchWith: {
              matchWithField: 'password',
              message: 'Confirm password must be validate with password',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        email: {
          rules: {
            notEmpty: {
              message: 'Email field can\'t be left blank',
              valid: false
            },
            emailCheck: {
              message: 'must be a valid email',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        dob: {
          rules: {
            notEmpty: {
              message: 'Dob field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        address: {
          rules: {
            notEmpty: {
              message: 'address field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        phoneNumber: {
          rules: {
            notEmpty: {
              message: 'Contact fields can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        zipCode: {
          rules: {
            notEmpty: {
              message: 'zipCode fields can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
      }
    };
  }
  
  handleCountry = (country) => {
        this.setState({country: country});
  }
  handleState = (state) => {
        this.setState({state: state});
  }
  handleCity = (city) => {
        this.setState({city: city});
  }
  
  handleSubscription = (subscriptions) => {
      this.setState({subscriptionPlan: subscriptions});        
  }
 
    
  cancelHandler(){
    this.props.history.push("/users");
  }
  
  fileChangedHandler = (event) => {
    this.setState({selectedFile: event.target.files[0]})
  }
  submitHandler(e){
      e.preventDefault();
      let formSubmitFlag = true;
      for (let field in this.state.validation) {
        let lastValidFieldFlag = true;
        let addUser = this.state.validation;
        addUser[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  addUser[field].valid = false;
                  addUser[field].message = addUser[field].rules[fieldCheck].message;

               }
              break;
            case 'emailCheck':
              if(lastValidFieldFlag === true && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this[field].value)){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addUser[field].valid = false;
                addUser[field].message = addUser[field].rules[fieldCheck].message;
              }
              break;
            case 'minLength':
              if(lastValidFieldFlag === true && this[field].value.length < parseInt(this.state.validation[field].rules[fieldCheck].length)){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addUser[field].valid = false;
                addUser[field].message = addUser[field].rules[fieldCheck].message;
              }
              break;
            case 'matchWith':
              if(lastValidFieldFlag === true && this[field].value !== this[this.state.validation[field].rules[fieldCheck].matchWithField].value){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addUser[field].valid = false;
                addUser[field].message = addUser[field].rules[fieldCheck].message;
              }
              break;
          }
        }
        this.setState({ validation: addUser});
      }
      if(formSubmitFlag){
        const data =new FD()
        data.append('firstName', this.firstName.value),
        data.append('middleName', this.middleName.value),
        data.append('lastName', this.lastName.value),
        data.append('userName', this.userName.value),
        data.append('password', this.password.value),
        data.append('email', this.email.value),
        data.append('profilePic', this.state.selectedFile)
        data.append('phoneNumber', this.phoneNumber.value),
        data.append('dob', this.dob.value), 
        data.append('address', this.address.value),
        data.append('city', this.state.city),
        data.append('state', this.state.state),
        data.append('country', this.state.country),
        data.append('zipCode', this.zipCode.value),
        data.append('subscriptionPlan', this.state.subscriptionPlan)
        axios.post('/user/signup', data).then(result => {
          console.log('USERasdasfdasdfasdfasdfasdfasdf', data)
          if(result.data.code === 200){
            this.props.history.push("/users");
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
                <strong>Add New User</strong>
                <small></small>
              </CardHeader>
              <CardBody>
              <Form noValidate>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">First name</Label><span className="required">*</span>
                      <Input type="text" invalid={this.state.validation.firstName.valid === false} innerRef={input => (this.firstName = input)} placeholder="First name" />
                       <FormFeedback invalid={this.state.validation.firstName.valid === false}>{this.state.validation.firstName.message}</FormFeedback>

                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">Middle name</Label>
                      <Input type="text" innerRef={input => (this.middleName = input)} placeholder="Middle name" />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="lastname">Last name</Label>
                      <Input type="text" innerRef={input => (this.lastName = input)} placeholder="Last name" />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="username">Username</Label><span className="required">*</span>
                  <Input type="text" invalid={this.state.validation.userName.valid === false}  innerRef={input => (this.userName = input)} placeholder="Username" />
                  <FormFeedback invalid={this.state.validation.userName.valid === false}>{this.state.validation.userName.message}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="password">Password</Label><span className="required">*</span>
                  <Input type="password" invalid={this.state.validation.password.valid === false}  innerRef={input => (this.password = input)} placeholder="Password" />
                  <FormFeedback invalid={this.state.validation.password.valid === false}>{this.state.validation.password.message}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="conform-password">Confirm Password</Label><span className="required">*</span>
                  <Input type="password" invalid={this.state.validation.confirmPassword.valid === false}  innerRef={input => (this.confirmPassword = input)} placeholder="Confirm Password" />
                  <FormFeedback invalid={this.state.validation.confirmPassword.valid === false}>{this.state.validation.confirmPassword.message}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="username">Email</Label><span className="required">*</span>
                  <Input type="email" invalid={this.state.validation.email.valid === false} innerRef={input => (this.email = input)} placeholder="Email" />
                  <FormFeedback invalid={this.state.validation.email.valid === false}>{this.state.validation.email.message}</FormFeedback>
                </FormGroup>
                 <FormGroup>
                  <Label htmlFor="contactnumber">Contact Number</Label>
                  <Input type="text" invalid={this.state.validation.phoneNumber.valid === false} innerRef={input => (this.phoneNumber = input)} placeholder="ContactNumber" />
                </FormGroup>
                 <FormGroup>
                  <Label htmlFor="contactnumber">Address</Label>
                  <Input type="textarea" invalid={this.state.validation.address.valid === false} innerRef={input => (this.address = input)} placeholder="Address" />
                </FormGroup>
               <FormGroup>
               <Row>
                  <Col xs="4" sm="4">
                  <Label htmlFor="username">DOB</Label>
                  <Input type="date" invalid={this.state.validation.dob.valid === false} innerRef={input => (this.dob = input)} placeholder="DOB" width="20%" />                 
				</Col>
                </Row>
                </FormGroup>
               
                 <FormGroup>
                  <Label htmlFor="username">Country</Label><span className="required">*</span>
                  <CountrySelectBox onSelectCountry={this.handleCountry}/>
                </FormGroup>
                
                 <FormGroup>
                  <Label htmlFor="state">State</Label><span className="required">*</span>
                  <StateAllSelectBox onSelectState={this.handleState}/>
                </FormGroup>
                 
                 <FormGroup>
                  <Label htmlFor="city">City</Label><span className="required">*</span>
                  <CitySelectBox onSelectCity={this.handleCity}/>
                </FormGroup>
                
                 <FormGroup>
                  <Label htmlFor="text">ZipCode</Label><span className="required">*</span>
                  <Input type="text" invalid={this.state.validation.zipCode.valid === false} innerRef={input => (this.zipCode = input)} placeholder="zipCode" />
                </FormGroup>
                
                 <FormGroup>
                  <Label htmlFor="username">Subscription Plan</Label>                 
                  <SubscriptionSelectBox onSelectSubscription={this.handleSubscription}/>
                </FormGroup>
                <FormGroup row>
                <Col md="3">
                      <Label htmlFor="image">Profile Image</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="file" innerRef={input => (this.profilePic = input)} onChange={this.fileChangedHandler} name="profilePic" />
                      {/* <FormFeedback invalid={this.state.validation.image.valid === false}>{this.state.validation.image.message}</FormFeedback> */}
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
          </Col>
        </Row>
        </div>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default UserAdd;
