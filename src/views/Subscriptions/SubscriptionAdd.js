import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';

// import PropTypes from 'prop-types';
class SubscriptionAdd extends Component {
  constructor(props){
    super(props);
    this.subscriptionName = React.createRef();
    this.description = React.createRef();
    this.price = React.createRef();
    this.totalTradePermitted = React.createRef();
    this.totalInventoryAllowed = React.createRef();
    this.timePeriod = React.createRef();
    
    this.state = {
      addSubscription: {},
      validation:{
        subscriptionName:{
          rules: {
            notEmpty: {
              message: 'Subscription name field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },        
        price:{
          rules: {
            notEmpty: {
              message: 'Price field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        totalTradePermitted:{
          rules: {
            notEmpty: {
              message: 'Total Trade Permitted field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        }, 
        totalInventoryAllowed:{
          rules: {
            notEmpty: {
              message: 'Total Inventory Allowed field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        }
        
      }
    };
  }
  cancelHandler(){
    this.props.history.push("/subscriptions");
  }
  submitHandler(e){
      e.preventDefault();
      let formSubmitFlag = true;
      for (let field in this.state.validation) {
        let lastValidFieldFlag = true;
        let addSubscription = this.state.validation;
        addSubscription[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  addSubscription[field].valid = false;
                  addSubscription[field].message = addSubscription[field].rules[fieldCheck].message;

               }
              break;
           
          }
        }
        this.setState({ validation: addSubscription});
      }
      if(formSubmitFlag){
        let addSubscription = this.state.addSubscription;
        addSubscription.subscriptionName = this.subscriptionName.value;
        addSubscription.description = this.description.value;
        addSubscription.price = this.price.value;
        addSubscription.totalTradePermitted = this.totalTradePermitted.value;
        addSubscription.totalInventoryAllowed = this.totalInventoryAllowed.value;
        addSubscription.timePeriod = this.timePeriod.value;
        addSubscription.userType = 2;
        axios.post('/subscription/newSubscription', addSubscription).then(result => {
          if(result.data.code == '200'){
            this.props.history.push("/subscriptions");
          }
        });
      }
  }

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Add New Subscription</strong>
                <small></small>
              </CardHeader>
              <CardBody>
              <Form noValidate>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="subscriptionName">Subscription Name</Label>
                      <Input type="text" invalid={this.state.validation.subscriptionName.valid === false} innerRef={input => (this.subscriptionName = input)} placeholder="Subscription Name" />

                      <FormFeedback invalid={this.state.validation.subscriptionName.valid === false}>{this.state.validation.subscriptionName.message}</FormFeedback>

                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="subsDescription">Subscription Description</Label>
                      <Input type="textarea" innerRef={input => (this.description = input)} placeholder="Subscription Description" />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="price">Price</Label>
                      <Input type="number" innerRef={input => (this.price = input)} placeholder="Price" />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="tTP">Total Trade Permitted</Label>
                  <Input type="number" invalid={this.state.validation.totalTradePermitted.valid === false}  innerRef={input => (this.totalTradePermitted = input)} placeholder="Total Trade Permitted" />
                  <FormFeedback invalid={this.state.validation.totalTradePermitted.valid === false}>{this.state.validation.totalTradePermitted.message}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="tIA">Total Inventory Allowed</Label>
                  <Input type="number" invalid={this.state.validation.totalInventoryAllowed.valid === false}  innerRef={input => (this.totalInventoryAllowed = input)} placeholder="Total Inventory Allowed" />
                  <FormFeedback invalid={this.state.validation.totalInventoryAllowed.valid === false}>{this.state.validation.totalInventoryAllowed.message}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="tIA">Time Period</Label>
                  <Input type="number"   innerRef={input => (this.timePeriod   = input)} placeholder="Time Period" />
                  
                </FormGroup>
                <FormGroup>                    
                    <Label htmlFor="Status">Status</Label>                    
                    <select innerRef={input => (this.status = input)} id="status" class="form-control" >
					  <option value="1">Active</option>
					  <option value="0">Inactive</option>					
                  </select>
                    
                </FormGroup> 
                <Row>
                  <Col xs="6" className="text-right">
                    <Button onClick={(e)=>this.submitHandler(e)} color="success" className="px-4">Submit</Button>
                  </Col>
                  <Col xs="6">
                    <Button onClick={()=>this.cancelHandler()} color="primary" className="px-4">Cancel</Button>
                  </Col>
                </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        </div>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default SubscriptionAdd;
