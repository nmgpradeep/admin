import React, { Component } from 'react';
import { Alert, Form, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';

// a select with dynamically created options
var options = []
class SizeSelectBox extends Component {
  constructor(props) {
    super(props);    
    this.state = { value: 'Select Size'};         
    this.state = {
			size : ''
	}   
  }
  onChange(e) {
		var size = e.target.value;	  
		this.props.onSelectSize(size); 
  }
  componentDidMount(){	
    axios.put('/size/listingsize').then(result => {		
		console.log('sizesslisting',result);
      if(result.data.code === 200){		  
		  options = result.data.result;		
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
		<option value="0">Select Size</option>
        {options.map(option => {
          return <option value={option._id} key={option.size}>{option.size.toUpperCase()}</option>
        })}
	  </Input>
      </div>
    )
  }
}
export default SizeSelectBox;
