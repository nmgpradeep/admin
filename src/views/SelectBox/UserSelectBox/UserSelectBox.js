import React, { Component } from 'react';
import { Alert, Form, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';

// a select with dynamically created options
var options = []

class UserSelectBox extends Component {
  constructor(props) {
    super(props);    
    this.state = { value: 'Select an Auther'}; 
        
    this.state = {
			user : ''
	}   
  }
  onChange(e) {
		var user = e.target.value;	  
		this.props.onSelectUser(user);  
		//this.setState({selectedUser : user});
    console.log("USER DATA SET",user)
  }
  componentDidMount(){
	//this.props.reference.value = this.props.value;
    axios.get('/user/listUser').then(result => {
		//console.log("listUser",result.data.result[0].userName);
      if(result.data.code === 200){		  
		  options = result.data.result;
		  //console.log("OPTION",result.data.result);
        //~ this.setState({
          //~ options: result.data.result,          
        //~ });
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
       <Input type="select" onChange={this.onChange.bind(this)} innerRef={this.props.reference} className="form-control">
		<option value="0" >Select an Auther</option>
        {options.map(option => {
          return <option value={option._id} key={option.userName}>{option.firstName.toUpperCase()} {option.lastName.toUpperCase()}</option>
        })}
	  </Input>
      </div>
      
    )
  }
}
export default UserSelectBox;
