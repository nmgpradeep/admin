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
// import PropTypes from 'prop-types';
class UserAdd extends Component {
  constructor(props){
    super(props);
    this.firstName = React.createRef();
    this.middleName = React.createRef();
    this.lastName = React.createRef();
    this.username = React.createRef();
    this.password = React.createRef();
    this.confirmPassword = React.createRef();
    this.email = React.createRef();
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
        }
      }
    };
  }
  cancelHandler(){
    this.props.history.push("/users");
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
        let addUser = this.state.addUser;
        addUser.firstName = this.firstName.value;
        addUser.middleName = this.middleName.value;
        addUser.lastName = this.lastName.value;
        addUser.userName = this.userName.value;
        addUser.password = this.password.value;
        addUser.email = this.email.value;
        addUser.userType = 2;
        axios.post('/user/signup', addUser).then(result => {
          if(result.data.code == '200'){
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
                <strong>User</strong>
                <small> Edit</small>
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
                  <Label htmlFor="password">Password</Label>
                  <Input type="password" invalid={this.state.validation.password.valid === false}  innerRef={input => (this.password = input)} placeholder="Password" />
                  <FormFeedback invalid={this.state.validation.password.valid === false}>{this.state.validation.password.message}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="conform-password">Confirm Password</Label>
                  <Input type="password" invalid={this.state.validation.confirmPassword.valid === false}  innerRef={input => (this.confirmPassword = input)} placeholder="Confirm Password" />
                  <FormFeedback invalid={this.state.validation.confirmPassword.valid === false}>{this.state.validation.confirmPassword.message}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="username">Email</Label>
                  <Input type="email" invalid={this.state.validation.email.valid === false} innerRef={input => (this.email = input)} placeholder="Email" />
                  <FormFeedback invalid={this.state.validation.email.valid === false}>{this.state.validation.email.message}</FormFeedback>
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
