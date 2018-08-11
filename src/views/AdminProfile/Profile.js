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
              profile: []       
          };
      }
      componentDidMount() {
        //if(localStorage.getItem('jwtToken') != null)
         //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
          axios.get('/user/getLoggedInUser').then(result => {
			  console.log("result.data",result.data.result)
            if(result.data.code === 200){
				console.log("result.data.result",result.data.result)
              //localStorage.setItem('jwtToken', result.data.result.accessToken);
              this.setState({ profile: result.data.result});              
            }
          })
          .catch((error) => {
            if(error.status === 401) {
          //    this.props.history.push("/login");
            }
          });
      }


  render() {
    const imageStyle = {
        width: 150,
        height: 150
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
                           <Col xs="4" sm="2">
								<FormGroup>
										<Label htmlFor="name">Name :</Label>
								</FormGroup>
							</Col>
							<Col xs="4" sm="6">
								<FormGroup>
										{this.state.profile.firstName+ ' '+ this.state.profile.lastName}
								</FormGroup>
							</Col>
							</Row>
                          <Row>
                           <Col xs="4" sm="2">
								<FormGroup>
										<Label htmlFor="username">UserName :</Label>
								</FormGroup>
							</Col>
							<Col xs="4" sm="6">
								<FormGroup>
										{this.state.profile.userName}
								</FormGroup>
							</Col>
							</Row>
							<Row>
							 <Col xs="4" sm="2">
								<FormGroup>
										<Label htmlFor="email">Email :</Label>
								</FormGroup>
							</Col>
							<Col xs="4" sm="6">
								<FormGroup>
										{this.state.profile.email}
								</FormGroup>
							</Col>
							</Row>
							<Row>
							 <Col xs="4" sm="2">
								<FormGroup>
										<Label htmlFor="phoneNumber">Phone Number :</Label>
								</FormGroup>
							</Col>
							<Col xs="4" sm="6">
								<FormGroup>
										{this.state.profile.phoneNumber}
								</FormGroup>
							</Col>
							</Row>
							<Row>
							 <Col xs="4" sm="2">
								<FormGroup>
										<Label htmlFor="address">Address :</Label>
								</FormGroup>
							</Col>
							<Col xs="4" sm="6">
								<FormGroup>
										{this.state.profile.userStatus}
								</FormGroup>
							</Col>
							</Row>
							<Row>
							 <Col xs="4" sm="2">
								<FormGroup>
										<Label htmlFor="city">City :</Label>
								</FormGroup>
							</Col>
							<Col xs="4" sm="6">
								<FormGroup>
										{this.state.profile.city}
								</FormGroup>
							</Col>
							</Row>							
							<Row>
							 <Col xs="4" sm="2">
								<FormGroup>
										<Label htmlFor="state">State :</Label>
								</FormGroup>
							</Col>
							<Col xs="4" sm="6">
								<FormGroup>
										{this.state.profile.state}
								</FormGroup>
							</Col>
							</Row>							
							<Row>
							 <Col xs="4" sm="2">
								<FormGroup>
										<Label htmlFor="country">Country :</Label>
								</FormGroup>
							</Col>
							<Col xs="4" sm="6">
								<FormGroup>
										{this.state.profile.country}
								</FormGroup>
							</Col>
							</Row>
							
							<Row>
							 <Col xs="4" sm="2">
								<FormGroup>
										<Label htmlFor="zipcode">Zip Code :</Label>
								</FormGroup>
							</Col>
							<Col xs="4" sm="6">
								<FormGroup>
										{this.state.profile.zipCode}
								</FormGroup>
							</Col>
							</Row>
							<Row>
							 <Col xs="4" sm="2">
								<FormGroup>
										<Label htmlFor="subscriptionPlan">Subscription Plan :</Label>
								</FormGroup>
							</Col>
							<Col xs="4" sm="6">
								<FormGroup>
										{this.state.profile.subscriptionPlan}
								</FormGroup>
							</Col>
							</Row>
							<Row>
						  <Col xs="4" sm="2">
								<FormGroup>
										<Label htmlFor="profilePic">Profile Picture :</Label>
								</FormGroup>
							</Col>
						  <Col xs="4" sm="6" >
							  <img style={imageStyle} src="https://i.ytimg.com/vi/N1icEHtgb3g/maxresdefault.jpg"/>
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
