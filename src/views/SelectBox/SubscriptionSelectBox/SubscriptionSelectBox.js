import React, { Component } from 'react';
import { Alert, Form, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';

// a select with dynamically created options
var options = []

class SubscriptionSelectBox extends Component {
  constructor(props) {	
	console.log('PROPS', props); 
    super(props);    
    this.state = { value: 'Select subscription'};         
    this.state = {
      subscriptions : []     
	};    
  }
  
  componentDidMount(){
	//getting all countries
    axios.get('/subscription/listingsubscription').then(result => {
      if(result.data.code === 200){	
        this.setState({
          subscriptions: result.data.result,          
        }, ()=>{
			if(this.props.subscriptionID){
				this.props.onSelectSubscription(this.props.subscriptionID);
				this.props.reference = this.props.subscriptionID;
			}
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
      <div className="form-group">{this.props.cityID}  
        <Input type="select" 
		onChange={(e) => this.props.onSelectSubscription(e.target.value)}
		innerRef={this.props.reference} className="form-control">
		<option value="0" >Select Subscription Plan</option>
        {this.state.subscriptions.map(option => {
          return <option value={option._id} key={option.subscriptionName} >{option.subscriptionName}</option>
        })}
	  </Input>
      </div>
      
    )
  }
}
export default SubscriptionSelectBox;
