import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { AppSwitch } from '@coreui/react'
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
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
    this.status = React.createRef();
    this.unlimited = React.createRef();
    
    this.state = {
      addSubscription: {},
      subs: {},
      disabled: false,
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
        
      }
    };
  }
  loadCommentsFromServer(){
    axios.get('/subscription/unlimited').then(result => {
      if(result.data.code === 200){
		this.setState({
          unlimited: result.data.result.unlimited,
          subs:result.data.result          
        });      
      // console.log('emailNotification',)
      }      
    })
    .catch((error) => {
    //console.log('error', error)
      if(error.code === 401) {
        this.props.history.push("/login");
      }
    });
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
        addSubscription.status = this.status.value;
        addSubscription.unlimited = this.state.unlimited;
        console.log("addSubscription",addSubscription)
        //addSubscription.unlimited = this.unlimited.value
        axios.post('/subscription/newSubscription', addSubscription).then(result => {
          if(result.data.code === 200){
            this.props.history.push("/subscriptions");
          }
        });
      }
  }

  handleChange(e){
     //this.setState({:e.target.checked})	 
	let  unlimited = ((e.target.checked)?1:0).toString()	
	this.setState({unlimited:unlimited});
	if(e.target.checked){
		this.setState( {disabled: !this.state.disabled} )
	}else{
		this.setState( {disabled: !this.state.disabled} )
	}
  }
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      this.loadCommentsFromServer();
  }
  
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
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
                      <Label htmlFor="price">Price ($)</Label>
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
                  <Input type="text" disabled = {(this.state.disabled)? "disabled" : ""} innerRef={input => (this.totalInventoryAllowed = input)} placeholder="Total Inventory Allowed"/>
                  {/* <FormFeedback invalid={this.state.validation.totalInventoryAllowed.valid === false}>{this.state.validation.totalInventoryAllowed.message}</FormFeedback> */}
                </FormGroup>
            
                <FormGroup row>
                <Col md="3">
                <label>Unlimited</label><br />
                </Col>
                <Col xs="12" md="9">
                <If condition={this.state.unlimited =="1"}>
							<Then>
              <AppSwitch className={'mx-1'} variant={'3d'} outline={'alt'} color={'primary'} checked label dataOn={'\u2713'} dataOff={'\u2715'} onChange={e => this.handleChange(e)}/>

							</Then>							
							<Else>
              <AppSwitch className={'mx-1'} variant={'3d'} outline={'alt'} color={'primary'} unchecked label dataOn={'\u2713'} dataOff={'\u2715'} onChange={e => this.handleChange(e)}/>

							</Else>
						  </If>
              </Col>		
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="tIA">Time Period (Month)</Label>
                  <Input type="number" innerRef={input => (this.timePeriod   = input)} placeholder="Time Period" />

                </FormGroup>
                <FormGroup>                    
                    <Label htmlFor="Status">Status</Label>                    
                   <Input type="select" innerRef={input => (this.status = input)} id="status" className="form-control" >
					  <option value="0">Active</option>
					  <option value="1">Inactive</option>					
					</Input>                     
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
