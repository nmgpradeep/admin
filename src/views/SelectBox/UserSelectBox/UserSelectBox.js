import React, { Component } from 'react';
import { Alert, Form, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';

// a select with dynamically created options
var options = []

class UserSelectBox extends Component {
  constructor(props) {
    super(props);    
    this.state = { value: 'Select an Auther'};
  }
  onChange(e) {
    this.setState({
      user: e.target.value
    })
    console.log("USER DATA SET",this.state.user)
  }
  componentDidMount(){
    axios.get('/user/listUser').then(result => {
		//console.log("listUser",result.data.result[0].userName);
      if(result.data.code === 200){
		  options = result.data.result;
		  //console.log("OPTION",result.data.result);
        this.setState({
          options: result.data.result,          
        });
      }
      
    })
    .catch((error) => {
    console.log('error', error)
      if(error.code === 401) {
        this.props.history.push("/login");
      }
    });
  }
  render() {
    return (
      <div className="form-group">        
        <select value={this.state.user} name="user" onChange={this.onChange.bind(this)} className="form-control">
        <option value="Select an Auther" >Select an Auther</option>
        {options.map(option => {
          return <option value={option.userName} key={option.userName} >{option.firstName.toUpperCase()} {option.lastName.toUpperCase()}</option>
        })}
      </select>
      </div>
      
    )
  }
}
//~ class Login extends Component {
  //~ onSubmit = (e) => {
    //~ e.preventDefault();

    //~ console.log('REFS', this.email.value +', ' + this.password.value);
    //~ const email = this.email.value;
    //~ const password = this.password.value;

    //~ axios.post('/user/login', { email: email, password:password, userType: '1'})
      //~ .then((result) => {
        //~ console.log('LOGIN RESULT', result)
        //~ if(result.data.code == '200'){
          //~ localStorage.setItem('jwtToken', result.data.result.accessToken);
          //~ this.setState({ message: '' });
          //~ this.props.history.push('/dashboard');
        //~ }else{
          //~ this.setState({
            //~ message: result.data.message
          //~ });
        //~ }
      //~ })
      //~ .catch((error) => {
        //~ console.log('error', error);
        //~ if (!error.status) {
			 //~ this.setState({ message: 'Login failed. Username or password not match' });
			//~ // network error
		//~ }

      //~ });
  //~ }
export default UserSelectBox;
