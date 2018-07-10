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
class AddonEdit extends Component {
  constructor(props){
    super(props);
    this.packageName = React.createRef();
    this.description = React.createRef();
    this.price = React.createRef();
    this.totalTradePermitted = React.createRef();
    this.totalInventoryAllowed = React.createRef();
    let addonId = this.props.match.params.id;
    this.state = {
      editAddon: {},
      addonId: addonId,
      validation:{
        packageName:{
          rules: {
            notEmpty: {
              message: 'Package name field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        description:{
          rules: {
            notEmpty: {
              message: 'Description field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        price: {
          rules: {
            notEmpty: {
              message: 'Price field can\'t be left blank',
              valid: false
            },
          },
          valid: null,
          message: ''
        },
        totalTradePermitted: {
          rules: {
            notEmpty: {
              message: 'Trade field can\'t be left blank',
              valid: false
            },
          },
          valid: null,
          message: ''
        },
        totalInventoryAllowed: {
          rules: {
            notEmpty: {
              message: 'Inventory field can\'t be left blank',
              valid: false
            },
          },
          valid: null,
          message: ''
        },
      }
    };
  }
  cancelHandler(){
    this.props.history.push("/addon");
  }
  submitHandler(e){
      e.preventDefault();
      let formSubmitFlag = true;
      for (let field in this.state.validation) {
        let lastValidFieldFlag = true;
        let addonAdd = this.state.validation;
        addonAdd[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  addonAdd[field].valid = false;
                  addonAdd[field].message = addonAdd[field].rules[fieldCheck].message;

               }
              break;
          }
        }
        this.setState({ validation: addonAdd});
      }

      if(formSubmitFlag){
        let editAddon = this.state.editAddon;
        editAddon.packageName = this.packageName.value;
        editAddon.description = this.description.value;
        editAddon.price = this.price.value;
        editAddon.totalTradePermitted = this.totalTradePermitted.value;
        editAddon.totalInventoryAllowed = this.totalInventoryAllowed.value;
        console.log("editAddon",editAddon)
        axios.put('/subscription/updateAddon', editAddon).then(result => {
          if(result.data.code ===200){
              this.props.history.push("/addon");
          }
        });
      }
  }

  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/subscription/viewAddon/' + this.state.addonId).then(result => {
       // console.log(result); 
         if(result.data.code === 200){
        //   //localStorage.setItem('jwtToken', result.data.result.accessToken);
           this.setState({ editAddon: result.data.result});
          
           this.packageName.value = result.data.result.packageName;
           this.description.value = result.data.result.description;
           this.price.value = result.data.result.price;
           this.totalTradePermitted.value = result.data.result.totalTradePermitted;
           this.totalInventoryAllowed.value = result.data.result.totalInventoryAllowed;

        }
      })
      .catch((error) => {
        if(error.status === 401) {
          this.props.history.push("/login");
        }
      });

  }
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Addon</strong>
                <small> Edit</small>
                <Link to="/addon" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
              
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label >Package Name</Label>
                      <Input type="text" innerRef={input => (this.packageName = input)}   placeholder="Package name" />

                      {/* <FormFeedback invalid={this.state.validation.advertisementName.valid === false}>{this.state.validation.advertisementName.message}</FormFeedback> */}

                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">Description</Label>
                      <Input type="text" innerRef={input => (this.description = input)} placeholder="Description" />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="lastname">Price</Label>
                      <Input type="number"   innerRef={input => (this.price = input)} placeholder="Price" required/>
                    </FormGroup>
                  </Col>
                  <Col xs="4" sm="12">
                    <FormGroup>
                    <Label htmlFor="username">Total Trade Permitted</Label>
                  <Input type="number" innerRef={input => (this.totalTradePermitted = input)} placeholder="Trade Permitted" />
                    </FormGroup>
                  </Col>
                  <Col xs="4" sm="12">
                    <FormGroup>
                    <Label htmlFor="username">Total Inventory Allowed</Label>
                  <Input type="number" innerRef={input => (this.totalInventoryAllowed = input)} placeholder="Inventory Allowed" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="6" className="text-right">
                    <Button onClick={(e)=>this.submitHandler(e)} color="success" className="px-4">Submit</Button>
                  </Col>
                  <Col xs="6">
                    <Button onClick={()=>this.cancelHandler()} color="primary" className="px-4">Cancel</Button>
                  </Col>
                </Row>
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
export default AddonEdit;
