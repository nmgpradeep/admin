import React, { Component } from 'react';
import { Alert, Form, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';

// a select with dynamically created options
var options = []

class CountrySelectBox extends Component {
  constructor(props) {	
	  console.log('PROPS', props); 
    super(props);    
    this.state = { value: 'Select a country'};         
    this.state = {
      countries : []     
	};    
  }
  
  componentDidMount(){
	//getting all countries
    axios.get('/location/listCountry').then(result => {
      if(result.data.code === 200){				 
		
        this.setState({
          countries: result.data.result,          
        }, ()=>{
			if(this.props.countryID){
				this.props.onSelectCountry(this.props.countryID);
				this.props.reference = this.props.countryID;
			}
		});
      }
      
    })
    .catch((error) => {    
      if(error.code === 401) {
        this.props.history.push("/login");
      }
    });
  }
  render() {	  
    return (
      <div className="form-group"> 
      {this.props.countryId}  
       <Input type="select" 
		onChange={(e) => this.props.onSelectCountry(e.target.value)}
		innerRef={this.props.reference} className="form-control">
		<option value="0" >Select a Country</option>
        {this.state.countries.map(option => {
          return <option value={option._id} key={option.countryName} selected={(this.props.value === option._id)?'selected':''}>{option.countryName.toUpperCase()}</option>
        })}
	  </Input>
      </div>
      
    )
  }
}
export default CountrySelectBox;
