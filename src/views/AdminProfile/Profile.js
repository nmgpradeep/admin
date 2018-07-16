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

  class Profile extends Component {
      constructor(props){
          super(props);
          this.state = {
              profile: [],
              adminId: this.props.match.params.id
          };
      }

      loadCommentsFromServer() {
          axios.get('/user/viewAdmin').then(result => {
              if(result.data.code === 200){
                this.setState({ profile: result.data.result});

              }
          })
          .catch((error) => {
              if(error.data.code === 401){
                  this.props.history.push('/login')
              }

          });
      }


  render() {
    const imageStyle = {
        width: 400,
        height: 350
    }
      return(
          <div className = "animated fadeIn">
            <Row>
                <Col  xs="12" sm="12">
                    <Card>
                        <CardHeader>
                            <strong>Admin Profile</strong>
                            <Link to="/editprofile  " className="btn btn-success btn-sm pull-right">Edit Profile</Link>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col>

                                    <Label>Name: {this.state.profile.firstName  }</Label><br></br>
                                    <Label>Email: {this.state.profile.email  }</Label><br></br>
                                    <Label>Phone Number: {this.state.profile.phoneNumber  }</Label><br></br>
                                    <Label>Address: {this.state.profile.address  }</Label><br></br>
                                    <Label>City: {this.state.profile.city  }</Label><br></br>
                                    <Label>Country: {this.state.profile.country  }</Label><br></br>
                                    <Label>Zip Code: {this.state.profile.zipCode  }</Label><br></br>
                                    <Label>Subscription Plan: {this.state.profile.subscriptionPlan  }</Label><br></br>

                                    
                                </Col>
                                <Col sm = "6">
                                    <img style={imageStyle} src="https://i.ytimg.com/vi/N1icEHtgb3g/maxresdefault.jpg" />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
          </div>
      );
  };
};


export default Profile