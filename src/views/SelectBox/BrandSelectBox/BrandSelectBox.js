import React, { Component } from 'react';
import { Alert, Form, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';

// a select with dynamically created options
var options = []

class BrandSelectBox extends Component {
  constructor(props) {
    super(props);    
    this.state = { value: 'Select brand'}; 
        
    this.state = {
			brand : ''
	}   
  }
  onChange(e) {
		var brand = e.target.value;	  
		this.props.onSelectBrand(brand); 
		
  }
  componentDidMount(){	
    axios.put('/brand/listingbrand').then(result => {		
		console.log('brand listing',result);
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
		<option value="0" >Select Brand</option>
        {options.map(option => {
          return <option value={option._id} key={option.brandName}>{option.brandName.toUpperCase()}</option>
        })}
	  </Input>
      </div>
      
    )
  }
}
export default BrandSelectBox;
