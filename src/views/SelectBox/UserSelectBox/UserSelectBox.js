import React, { Component } from 'react';
import { Alert, Form, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';
import Select from 'react-styled-select'

// a select with dynamically created options
var options = []

class UserSelectBox extends Component {
  constructor(props) {
    super(props);    
    this.state = { value: 'Select an Auther'} ; 
    this.state = { user : ''}    
    this.state = { selectedValue : ''}    
  }
  
  onChange(e){
	 if(e){
	    console.log('e',e);
	   this.setState({selectedValue: e});
	   this.props.onSelectUser(e);  
      }
  }
  
  
  componentDidMount(){
    axios.get('/user/listUser').then(result => {
      if(result.data.code === 200){		  
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
     let optionsLists;
      if(this.state.options){
        let optionsList = this.state.options;                
         optionsLists = optionsList.map(option => ({ label: option.userName, value: option._id }));  
     }	
    return (
     <Select options={optionsLists}	value={this.props.value} onChange ={this.onChange.bind(this)} innerRef={this.props.reference} classes={{  selectValue: 'my-custom-value', selectArrow: 'my-custom-arrow'}}
		/>
    )
  }
}
export default UserSelectBox;
