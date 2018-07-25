import React, { Component } from 'react';
import { Alert, Form, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';

// a select with dynamically created options

class StateSelectBox extends Component {
  render() {	  
    return (
      <div className="form-group">        
       <Input type="select" innerRef={this.props.reference} className="form-control">
		<option value="0" >Select a State</option>
        {this.props.options.map(option => {
          return <option value={option._id} key={option.stateName}>{option.stateName.toUpperCase()}</option>
        })}
	  </Input>
      </div>
      
    )
  }
}
export default StateSelectBox;
