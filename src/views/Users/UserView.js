import React, { Component } from 'react';

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
import axios from 'axios';
// import PropTypes from 'prop-types';
class UserView extends Component {
  constructor(props){
    super(props);
    this.state = {
      viewUser: [],
      userId: this.props.match.params.id
    };
  }
  cancelHandler(){
    this.props.history.push("/users");
  }
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/user/viewUser/' + this.state.userId).then(result => {
        if(result.data.code == '200'){
          console.log('sssss',result);
          this.setState({ viewUser: result.data.result});
          this.firstName.value = result.data.result.firstName
          this.middleName.value = result.data.result.middleName
          this.lastName.value = result.data.result.lastName
          this.userName.value = result.data.result.userName
          this.email.value = result.data.result.email
          this.phoneNumber.value = result.data.result.phoneNumber
          this.dob.value = result.data.result.dob
          this.address.value = result.data.result.address
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
                <strong>View User</strong>
                <small> </small>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="id">ID</Label>
                  <Input type="text" value={this.state.viewUser._id} />
                </FormGroup>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">First name</Label>
                      <Input type="text" value={this.state.viewUser.firstName} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">Middle name</Label>
                      <Input type="text" value={this.state.viewUser.middleName} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="lastname">Last name</Label>
                      <Input type="text" value={this.state.viewUser.lastName} />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="username">Username</Label>
                  <Input type="text" value={this.state.viewUser.userName} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input type="text" value={this.state.viewUser.email} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="phoneNumber">Contact Number</Label>
                  <Input type="text" value={this.state.viewUser.phoneNumber} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="dob">DOB</Label>
                  <Input type="text" value={this.state.viewUser.dob} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="dob">Address</Label>
                  <Input type="textarea" value={this.state.viewUser.address} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">City</Label>
                  <Input type="text" value={(this.state.viewUser.city)?this.state.viewUser.city.cityName:""} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">State</Label>
                  <Input type="text" value={(this.state.viewUser.state)?this.state.viewUser.state.stateName:""} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Country</Label>
                  <Input type="text" value={(this.state.viewUser.country)?this.state.viewUser.country.countryName:""} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input type="text" value={this.state.viewUser.zipCode} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Subscription Plan  </Label>
                  <Input type="text" value={this.state.viewUser.subscriptionPlan} />
                </FormGroup>
                <FormGroup>
                <Col xs="12" className="text-left">
                  <Label htmlFor="status">Profile Image</Label>
                   </Col>
                  <Col xs="12" sm="12">
                  <img className="linkedin" src= {'assets/uploads/ProfilePic/'+this.state.viewUser.profilePic} width="60"/>
                  </Col>
                  
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="status">Status</Label>
                  <Input type="text" value={(this.state.viewUser.userStatus === '1')?'Active':'Inactive'} />
                </FormGroup>
                <Row>
                  <Col xs="6" className="text-right">
                    <Button onClick={()=>this.cancelHandler()} color="primary" className="px-4">Cancel</Button>
                  </Col>
                  <Col xs="6">

                  </Col>
                </Row>
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
export default UserView;
