import React, { Component } from 'react';
import { Alert, Form, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';
import Select from 'react-styled-select'
import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'


var options = []

class CategorySelectBox extends Component {
  constructor(props) {
    super(props);    
    this.state = { value: 'Select Category', category : '', data: []}; 
  }
  
  onChange(e) {
	  console.log('State Properties', this.state);
		var category = e;	  
		//this.props.onSelectCategory(e);  		
        //console.log("USER DATA SET",category)
  }
  
  componentDidMount(){
    axios.get('/category/allCategories').then(result => {
      if(result.data.code === 200){		  
        this.setState({
          data: result.data.result,           
        });
      }
      //console.log('mkmkmkmkmk',this.state.options);
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
          optionsLists = optionsList.map(option => ({ label: option.title, value: option.title }));
       }
	 
	//~ const data = {
	  //~ label: 'Please select',
	  //~ value :'0',
	  //~ children: [
		//~ {
		  //~ label: 'search me too',
		  //~ value: 'searchmetoo',
		  //~ children: [
			//~ {
			  //~ label: 'asdf',
			  //~ value: 'asdfasdf',
			   //~ children: [
					//~ {
					  //~ label: '16',
					  //~ value: '15',				 
					//~ },
					//~ {
					  //~ label: '266',
					  //~ value: '156',				 
					//~ }
			   //~ ],	
			//~ }
		  //~ ]		  
		//~ },
		//~ {
		  //~ label: 'search me too',
		  //~ value: 'searchmetoo',
		  //~ children: [
			//~ {
			  //~ label: 'asdf',
			  //~ value: 'asdfasdf',
			   //~ children: [
				//~ {
				  //~ label: '16',
				  //~ value: '15',				 
				//~ },
				//~ {
				  //~ label: '266',
				  //~ value: '156',				 
				//~ }
			   //~ ],	
			//~ }
		  //~ ]		  
		//~ }
	  //~ ],
	//~ } 
	 
	  	  
    return (
       <DropdownTreeSelect data={this.state.data} clearSearchOnChange={true} placeholderText="Search" />
      
    )
  }
}
export default CategorySelectBox;
