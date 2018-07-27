import React, { Component } from 'react';
import { Alert, Form, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';
import { Link } from "react-router-dom";
class ResetPassword extends Component {
  constructor() {
    super();
    this.password = React.createRef();
    this.confirmPassword = React.createRef();
    //let userId = this.props.params.id;
    this.state = {
      changePassword: {},
      message: ''
    };
  }


  submitHandler(e){
    e.PreventDefault();
    let formSubmitFlag = true;
    if(formSubmitFlag){
      let changePassword = this.state.changePassword;
      changePassword.password = this.password.value;
      changePassword.confirmPassword = this.changePassword.value;
      console.log('new password', changePassword)
      axios.post('/user/resetPassword', changePassword).then(result=>{
        if(result.data.code == '200'){
          this.props.history.push('/login');
        }
      })
    } 
  }

  // onSubmit = (e) => {
  //   e.preventDefault();

  //   console.log('REFS', this.email.value +', ' + this.password.value);
  //   const password = this.password.value;
  //   const confirmPassword = this.confirmPassword.value;

  //   axios.get('/user/resetPassword/' + this.state.userId)
  //     .then((result) => {
  //       console.log('Reset password result', result)
  //       if(result.data.code == '200'){
  //         localStorage.setItem('jwtToken', result.data.result.accessToken);
  //         // this.setState({ message: '' });
  //         // this.props.history.push('/dashboard');
  //       }else{
  //         this.setState({
  //           message: result.data.message
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log('error', error);
  //       if (!error.status) {
	// 		 this.setState({ message: 'Password did not match' });
	// 		// network error
	// 	}

  //     });
  // }

  
  render() {
    const { password, confirmPassword, message } = this.state;
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
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" innerRef={input => (this.password = input)} placeholder="Password" />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" innerRef={input => (this.confirmPassword = input)} placeholder="confirmPassword" />
                    </InputGroup>
                    {message !== '' &&
                      <Alert color="danger">
                        { message }
                      </Alert>
                    }
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
