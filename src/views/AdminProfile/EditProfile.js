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
class AdminProfile extends Component {
  constructor(props){
    super(props);
    this.firstName = React.createRef();
    this.middleName = React.createRef();
    this.lastName = React.createRef();
    this.email = React.createRef();
    this.phoneNumber = React.createRef();
    this.address = React.createRef();
    this.city = React.createRef();
    this.state = React.createRef();
    this.country = React.createRef();
    this.zipCode = React.createRef();
    this.subscriptionPlan = React.createRef();
    let adminId = this.props.match.params.id
    this.state = {
      editUser: {},
      adminId: adminId,
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
  cancelHandler(){
    this.props.history.push("/dashboard");
  }
  submitHandler(e){
      e.preventDefault();
      let formSubmitFlag = true;
      for(let field in this.state.validation) {
        let lastValidFieldFlag = true;
        let addadmin = this.state.validation;
        addadmin[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  addadmin[field].valid = false;
                  addadmin[field].message = addadmin[field].rules[fieldCheck].message;

               }
              break;
            case 'emailCheck':
              if(lastValidFieldFlag === true && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this[field].value)){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addadmin[field].valid = false;
                addadmin[field].message = addadmin[field].rules[fieldCheck].message;
              }
              break;
            case 'minLength':
              if(lastValidFieldFlag === true && this[field].value.length < parseInt(this.state.validation[field].rules[fieldCheck].length)){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addadmin[field].valid = false;
                addadmin[field].message = addadmin[field].rules[fieldCheck].message;
              }
              break;
            case 'matchWith':
              if(lastValidFieldFlag === true && this[field].value !== this[this.state.validation[field].rules[fieldCheck].matchWithField].value){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addadmin[field].valid = false;
                addadmin[field].message = addadmin[field].rules[fieldCheck].message;
              }
              break;
          }
        }
        this.setState({ validation: addadmin});
      }

      if(formSubmitFlag){
        let editAdmin = this.state.editAdmin;
        editAdmin.firstName = this.firstName.value;
        editAdmin.middleName = this.middleName.value;
        editAdmin.lastName = this.lastName.value;
        editAdmin.email = this.email.value;
        editAdmin.phoneNumber = this.email.value;
        editAdmin.address = this.email.value;
        editAdmin.city = this.email.value;
        editAdmin.state = this.email.value;
        editAdmin.country = this.email.value;
        editAdmin.zipCode = this.email.value;
        editAdmin.subscriptionPlan = this.email.value;
        console.log('<user id>',editAdmin);
        axios.post('/user/updateAdmin', editAdmin).then(result => {
          if(result.data.code == '200'){
            this.props.history.push("/users");
          }
        });
      }
  }

  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/user/viewAdmin/').then(result => {
		  
        if(result.data.code == '200'){
          //localStorage.setItem('jwtToken', result.data.result.accessToken);
          this.setState({ editAdmin: result.data.result});
          this.firstName.value = result.data.result.firstName;
          this.middleName.value = result.data.result.middleName;
          this.lastName.value = result.data.result.lastName;
          this.email.value = result.data.result.email;
          this.phoneNumber.value = result.data.result.phoneNumber;
          this.address.value = result.data.result.address;
          this.city.value = result.data.result.city;
          this.state.value = result.data.result.state;
          this.country.value = result.data.result.country;
          this.zipCode.value = result.data.result.zipCode;
          this.subscriptionPlan.value = result.data.result.subscriptionPlan;
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
                <strong>Admin</strong>
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
                  <Label htmlFor="username">email</Label>
                  <Input type="email" invalid={this.state.validation.email.valid === false}  innerRef={input => (this.email = input)} placeholder="Username" />
                  <FormFeedback invalid={this.state.validation.email.valid === false}>{this.state.validation.email.message}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="username">Address</Label>
                  <Input type="text" innerRef={input => (this.address = input)} placeholder="Email" />
                  {/* <FormFeedback invalid={this.state.validation.address.valid === false}>{this.state.validation.address.message}</FormFeedback> */}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="username">City</Label>
                  <Input type="text" innerRef={input => (this.city = input)} placeholder="Email" />
                  {/* <FormFeedback invalid={this.state.validation.city.valid === false}>{this.state.validation.city.message}</FormFeedback> */}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="username">State</Label>
                  <Input type="text"  innerRef={input => (this.state = input)} placeholder="Email" />
                  {/* <FormFeedback invalid={this.state.validation.state.valid === false}>{this.state.validation.state.message}</FormFeedback> */}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="username">Country</Label>
                  <Input type="text"  innerRef={input => (this.country = input)} placeholder="Email" />
                  {/* <FormFeedback invalid={this.state.validation.country.valid === false}>{this.state.validation.country.message}</FormFeedback> */}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="username">Zip Code</Label>
                  <Input type="number" innerRef={input => (this.zipCode = input)} placeholder="Email" />
                  {/* <FormFeedback invalid={this.state.validation.zipCode.valid === false}>{this.state.validation.zipCode.message}</FormFeedback> */}
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
export default AdminProfile;
