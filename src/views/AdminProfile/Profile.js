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
              profile:{},
          };
      }
      componentDidMount() {
        //if(localStorage.getItem('jwtToken') != null)
         //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
          axios.get('/user/myProfle').then(result => {			
            if(result.data.code === 200){				
              //localStorage.setItem('jwtToken', result.data.result.accessToken);
              this.setState({profile:result.data.result});              
              console.log("profile state",this.state.profile[0])
            }
            
          })
          .catch((error) => {
			  console.log("profile error",error)
            if(error.status === 401) {
             // this.props.history.push("/login");
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
                           {/* <Link to="/admin/editProfile" className="btn btn-success btn-sm pull-right">Edit Profile</Link> */}
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
										{this.state.profile[0]?(this.state.profile[0].firstName+ ' '+ this.state.profile[0].lastName):''}
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
										{this.state.profile[0]?(this.state.profile[0].userName):''}
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
										{this.state.profile[0]?(this.state.profile[0].email):''}
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
										{this.state.profile[0]?(this.state.profile[0].phoneNumber):''}										
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
										{this.state.profile[0]?(this.state.profile[0].address):''}									
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
										{this.state.profile[0] && this.state.profile[0].city?(this.state.profile[0].city.cityName):''}										
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
										{this.state.profile[0] && this.state.profile[0].state?(this.state.profile[0].state.stateName):''}
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
										{this.state.profile[0] && this.state.profile[0].country?(this.state.profile[0].country.countryName):''}
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
										{this.state.profile[0]?(this.state.profile[0].zipCode):''}											
								</FormGroup>
							</Col>
							</Row>
							{/*<Row>
							 <Col xs="4" sm="2">
								<FormGroup>
										<Label htmlFor="subscriptionPlan">Subscription Plan :</Label>
								</FormGroup>
							</Col>
							<Col xs="4" sm="6">
								<FormGroup>										
										{this.state.profile[0]?(this.state.profile[0].subscriptionPlan):''}
								</FormGroup>
							</Col>
							</Row> */}
							<Row>
						  <Col xs="4" sm="2">
								<FormGroup>
										<Label htmlFor="profilePic">Profile Picture :</Label>
								</FormGroup>
							</Col>
						  <Col xs="4" sm="6" >
							  <img style={imageStyle} src="https://i.ytimg.com/vi/N1icEHtgb3g/maxresdefault.jpg" alt=""/>
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
