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

      componentDidMount() {
        //if(localStorage.getItem('jwtToken') != null)
          //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
          axios.get('/user/viewAdmin').then(result => {
            if(result.data.code === 200){
              //localStorage.setItem('jwtToken', result.data.result.accessToken);
              this.setState({ profile: result.data.result});
              
            }
          })
          .catch((error) => {
            if(error.status === 401) {
              this.props.history.push("/login");
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
                                <Row>
                                <Col md='3'>
                                <Label>Name:</Label>
                                </Col>
                                <Col md='3'>
                                <Label>{this.state.profile.firstName}</Label>
                                </Col>
                                </Row>
                                    {/* <Label>Name:</Label><br></br>
                                    <Label>Email:</Label><br></br>
                                    <Label>Phone Number:</Label><br></br>
                                    <Label>Address:</Label><br></br>
                                    <Label>City:</Label><br></br>
                                    <Label>Country:</Label><br></br>
                                    <Label>Zip Code:</Label><br></br>
                                    <Label>Subscription Plan:</Label><br></br> */}

                                    
                                
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
