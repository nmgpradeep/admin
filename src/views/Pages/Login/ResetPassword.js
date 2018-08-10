import React, { Component } from 'react';
import { Alert, Form, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';
import { Link } from "react-router-dom";
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
 import {
  Badge, 
  FormGroup,
  FormText,
  FormFeedback,  
  Label,  
} from 'reactstrap';
var FD = require('form-data');
var fs = require('fs');
var code = 201;
class ResetPassword extends Component {
  constructor() {
    super();    
    this.password = React.createRef();
    this.confirmPassword = React.createRef();
        this.state = {
			message: '',
			code:9999,
			resetPassword: {},      
			  validation:{      
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
				
			  }
    };
  }
    submitHandler(e){
		 
      e.preventDefault();
      let formSubmitFlag = true;
      for (let field in this.state.validation) {
        let lastValidFieldFlag = true;
        let resetPassword = this.state.validation;
        resetPassword[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  resetPassword[field].valid = false;
                  resetPassword[field].message = resetPassword[field].rules[fieldCheck].message;

               }
              break;
           
            case 'minLength':
              if(lastValidFieldFlag === true && this[field].value.length < parseInt(this.state.validation[field].rules[fieldCheck].length)){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                resetPassword[field].valid = false;
                resetPassword[field].message = resetPassword[field].rules[fieldCheck].message;
              }
              break;
            case 'matchWith':
              if(lastValidFieldFlag === true && this[field].value !== this[this.state.validation[field].rules[fieldCheck].matchWithField].value){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                resetPassword[field].valid = false;
                resetPassword[field].message = resetPassword[field].rules[fieldCheck].message;
              }
              break;
          }
        }
        this.setState({ validation: resetPassword});
      }
     if(formSubmitFlag){     
		const password = this.password.value;        
        axios.post('/user/updateNewPassword',{_id:this.props.match.params.id,password:password}).then(result => {      
          if(result.data.code === 200){
           // this.props.history.push("/login");
             this.setState({
				message: result.data.message,
				code :result.data.code
			}); 
          }
        });
      }
  }
  
  
  render() {
    const { password, confirmPassword, message,code } = this.state;   
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <p className="text-muted">Enter New Password</p>
                    <Form onSubmit={this.onSubmit}>                    
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
                
                      <If condition={message !== '' && code ===200}>
						<Then>
							<Alert color="success">
								{ message }
							</Alert>
						</Then>
						<ElseIf condition={message !== '' && code !==200 }>
							<Alert color="danger">
								{ message }
							</Alert>
						</ElseIf>						
					  </If>
                   
                    <Row>
                      <Col xs="6">
                        <Button color="primary" onClick={(e)=>this.submitHandler(e)}  className="px-4">Submit</Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        
                        <Link to={'/login'}>Login</Link>
                      </Col>
                    </Row>
                    </Form>
                  </CardBody>
                </Card>
                { /*<Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Button color="primary" className="mt-3" active>Register Now!</Button>
                    </div>
                  </CardBody>
                </Card> */}
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ResetPassword;
