import React, { Component } from 'react';
import { Alert, Form, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';
import Select from 'react-styled-select'

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
	var brand = e;	  
	this.setState({value: e});
	this.props.onSelectBrand(e); 		
  }  
  
  componentDidMount(){	
    axios.get('/brand/listingbrand').then(result => {		
		console.log('brand listing',result);
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
  render(){
   let optionsLists;
      if(this.state.options){
        let optionsList = this.state.options;        
         optionsLists = optionsList.map(option => ({ label: option.brandName, value: option._id }));
          
     }
     return ( 
		 <Select
			options={optionsLists}
			onChange={this.onChange.bind(this)} 
			innerRef={this.props.reference}
			value={this.props.value}
			classes={{
			  selectValue: 'my-custom-value',
			  selectArrow: 'my-custom-arrow'
			}}
		  />
      )
  }
}
export default BrandSelectBox;
