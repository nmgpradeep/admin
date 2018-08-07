import React, { Component } from 'react';
import { Alert, Form, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';
import { Link } from "react-router-dom";
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';

class Login extends Component {
  constructor() {
    super();
    this.email = React.createRef();
    this.password = React.createRef();
    this.state = {
      email: '',
      password: '',
      message: ''
    };
  }


  onSubmit = (e) => {
    e.preventDefault();
   // console.log('REFS', this.email.value +', ' + this.password.value);
    const email = this.email.value;
    const password = this.password.value;

    axios.post('/user/login', { email: email, password:password, userType: '1'})
      .then((result) => {
		  
        console.log('LOGIN RESULT', result)
        if(result.data.code === 200){
		  console.log("accessToken",result.data.token)		
          localStorage.setItem('jwtToken', result.data.token);
          this.setState({ message: '' });
          this.props.history.push('/dashboard');
        }else{
          this.setState({
            message: result.data.message
          });
        }
      })
      .catch((error) => {
        console.log('error', error);
        if (!error.status) {
			 this.setState({ message: 'Login failed. Username or password not match' });
			// network error
		}

      });
  }

  
  render() {
    const { email, password, message } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <Form onSubmit={this.onSubmit}>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" innerRef={input => (this.email = input)} placeholder="Username/Email" />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" innerRef={input => (this.password = input)} placeholder="Password" />
                    </InputGroup>
					
					{message !== '' &&
                      <Alert color="danger">
                        { message }
                      </Alert>
                    }
                    <Row>
                      <Col xs="6">
                        <Button color="primary" onClick={this.loginClickHandler} className="px-4">Login</Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        
                        <Link to={'/forgotPassword'}><Button color="link" className="px-0" >Forgot password?</Button></Link>
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

export default Login;
