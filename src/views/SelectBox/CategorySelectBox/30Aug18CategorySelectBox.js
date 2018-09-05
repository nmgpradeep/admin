import React, { Component } from 'react';
import { Alert, Form, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';

// a select with dynamically created options
var options = []

class CategorySelectBox extends Component {
  constructor(props) {
    super(props);    
    this.state = { value: 'Select Category'}; 
    this.state = {
			category : ''
	}   
  }
  onChange(e) {
		var category = e.target.value;	  
		this.props.onSelectCategory(category);  		
        console.log("USER DATA SET",category)
  }
  
  componentDidMount(){
    axios.get('/category/allCategories').then(result => {
      if(result.data.code === 200){		  
		  options = result.data.result;
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
       <Input type="select" onChange={this.onChange.bind(this)} innerRef={this.props.reference} className="form-control">
		<option value="0" >Select Category</option>
        {options.map(option => {
          return <option value={option._id} key={option.title}>{option.title}</option>
        })}
	  </Input>
      </div>
    )
  }
}
export default CategorySelectBox;
