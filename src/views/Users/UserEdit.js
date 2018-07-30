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
class UserEdit extends Component {
  constructor(props){
    super(props);
    this.firstName = React.createRef();
    this.middleName = React.createRef();
    this.lastName = React.createRef();
    this.username = React.createRef();
    this.email = React.createRef();
    this.phoneNumber = React.createRef();
    this.dob = React.createRef();
    this.city = React.createRef();
    this.state = React.createRef();
    this.country = React.createRef();
    this.zipCode = React.createRef();
    this.subscriptionPlan = React.createRef();
    this.profilePic = React.createRef();

    let userId = this.props.match.params.id;
    this.state = {
      editUser: {},
      userId: userId,
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
        }
      }
    };
  }
  fileChangedHandler = (event) => {
	  this.setState({selectedFile: event.target.files[0]})
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
    this.setState({subscriptions: subscriptions});
}

  cancelHandler(){
    this.props.history.push("/users");
  }
  submitHandler(e){
      e.preventDefault();
      let formSubmitFlag = true;
      for(let field in this.state.validation) {
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
        const data = new FD()
        data.append('_id', this.state.userId)
        data.append('firstName', this.firstName.value)
        data.append('middleName', this.middleName.value)
        data.append('lastName', this.lastName.value)
        data.append('userName', this.userName.value)
        data.append('email', this.email.value)
        data.append('phoneNumber', this.phoneNumber.value)
        data.append('dob', this.dob.value)
        data.append('city', this.city.value)
        data.append('state',this.state.state)
        data.append('country',this.country.value)
        data.append('zipCode', this.zipCode.value)
        data.append('subscriptionPlan',this.subscriptionPlan.value)

        if(this.state.selectedFile){
          data.append('profilePic', this.state.selectedFile, this.state.selectedFile.name)
         } else {
          data.append('profilePic', this.state.editUser.profilePic);
       }
        // let editUser = this.state.editUser;
        // editUser.firstName = this.firstName.value;
        // editUser.middleName = this.middleName.value;
        // editUser.lastName = this.lastName.value;
        // editUser.userName = this.userName.value;
        // editUser.email = this.email.value;
        console.log('<user id>',data);
        axios.post('/user/updateUser', data).then(result => {
          if(result.data.code == '200'){
            this.props.history.push("/users");
          }
        });
      }
  }

  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/user/viewUser/' + this.state.userId).then(result => {
        if(result.data.code == '200'){
          //localStorage.setItem('jwtToken', result.data.result.accessToken);
          this.setState({ editUser: result.data.result});
          this.firstName.value = result.data.result.firstName;
          this.middleName.value = result.data.result.middleName;
          this.lastName.value = result.data.result.lastName;
          this.userName.value = result.data.result.userName;
          this.email.value = result.data.result.email;
          this.phoneNumber.value = result.data.result.phoneNumber
          this.dob.value = result.data.result.dob
          this.city.value = result.data.result.city
          this.state.value = result.data.result.state
          this.country.value = result.data.result.country
          this.zipCode.value = result.data.result.zipCode
          this.subscriptionPlan.value = result.data.result.subscriptionPlan
          this.profilePic.value = result.data.result.profilePic
        }
      })
      .catch((error) => {
        if(error.status === 401) {
          this.props.history.push("/login");
        }
      });

  }
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>User Edit</strong>
                <small> </small>
              </CardHeader>
              <CardBody>
              <Form noValidate>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">First name</Label>
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
                  <Label htmlFor="username">Username</Label>
                  <Input type="text" invalid={this.state.validation.userName.valid === false}  innerRef={input => (this.userName = input)} placeholder="Username" />
                  <FormFeedback invalid={this.state.validation.userName.valid === false}>{this.state.validation.userName.message}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="username">Email</Label>
                  <Input type="email" invalid={this.state.validation.email.valid === false} innerRef={input => (this.email = input)} placeholder="Email" />
                  <FormFeedback invalid={this.state.validation.email.valid === false}>{this.state.validation.email.message}</FormFeedback>
                </FormGroup>
              <FormGroup>
               <Label>Contact Number</Label>
               <Input type='text' innerRef={input => (this.phoneNumber = input)} placeholder='Contact Number'/>
              </FormGroup>
              <FormGroup>
               <Label>DOB</Label>
               <Input type='text' innerRef={input => (this.dob = input)} placeholder='DOB'/>
              </FormGroup>
              <FormGroup>
               <Label>City</Label>
               <CitySelectBox onSelectCity={this.handleCity} reference={(city)=> this.city=city} value = {this.state.editUser.city}/>
              </FormGroup>
              <FormGroup>
               <Label>State</Label>
               <StateAllSelectBox onSelectState={this.handleState} reference={(state)=> this.state=state} value = {this.state.editUser.state}/>
              </FormGroup>
              <FormGroup>
               <Label>Country</Label>
               <CountrySelectBox onSelectCountry={this.handleCountry} reference={(country)=> this.country=country} value={this.state.editUser.country} />
              </FormGroup>
              <FormGroup>
               <Label>Zip Code</Label>
               <Input type='text' innerRef={input => (this.zipCode = input)} placeholder='Contact Number'/>
              </FormGroup>
              <FormGroup>
               <Label>Subscription Plan</Label>
               <SubscriptionSelectBox onSelectSubscription = {this.handleSubscription} reference={(subscriptionPlan) => this.subscriptionPlan=subscriptionPlan} value={this.state.editUser.subscriptionPlan}/>
              </FormGroup>
                <FormGroup>
						 <Label htmlFor="brand">Profile Image</Label>                  
						  <Input type="file" innerRef={input => (this.profilePic = input)} onChange={this.fileChangedHandler} placeholder="Advertisement Image" /> 	
						  <img src={'assets/uploads/ProfilePic/'+this.state.editUser.profilePic} width="60"/>
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
export default UserEdit;
