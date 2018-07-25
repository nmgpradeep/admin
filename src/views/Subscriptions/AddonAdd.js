import React,{ Component }from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
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
class AddonAdd extends Component {

  constructor(props){
    super(props)
    this.packageName = React.createRef(),
    this.description = React.createRef(),
    this.price = React.createRef(),
    this.totalTradePermitted = React.createRef(),
    this.totalInventoryAllowed = React.createRef(),    
    this.state = {
      addonAdd: {},
      validation:{
        packageName: {
          rules: {
            notEmpty: {
              message: 'Package Name can\'t be left blank',
              valid: false

            }
          },
          valid: null,
          message: ''
        },
        description:{
          rules: {
            notEmpty: {
              message: 'Addon description can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        price: {
          rules: {
            notEmpty: {
              message: 'Price can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        totalTradePermitted: {
          rules: {
            notEmpty: {
              message: 'Total Trade can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        totalInventoryAllowed: {
          rules: {
            notEmpty: {
              message: 'Total Inventory can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
      }
    } 
  }

  submitHandler(e){
    e.preventDefault()
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
      let addonAdd = this.state.addonAdd;
      addonAdd.packageName = this.packageName.value;
      addonAdd.description = this.description.value;
      addonAdd.price = this.price.value;
      addonAdd.totalTradePermitted = this.totalTradePermitted.value;
      addonAdd.totalInventoryAllowed = this.totalInventoryAllowed.value;
      axios.post('/subscription/newAddon', addonAdd  ).then(result => {
        if(result.data.code == '200'){
          this.props.history.push('./Addon');
        }
      })
    }
  }
  cancelHandler(){
    this.props.history.push("/addon");
  }

  render(){
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>New Addon Form</strong>
                <small></small>
              </CardHeader>
              <CardBody>
              <Form noValidate>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="packageName">Package Name</Label>
                      <Input type="text" invalid={this.state.validation.packageName.valid === false} innerRef={input => (this.packageName = input)} placeholder="Package Name" />

                      <FormFeedback invalid={this.state.validation.packageName.valid === false}>{this.state.validation.packageName.message}</FormFeedback>

                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="Packagedescription">Package Description</Label>
                      <Input type="textarea" innerRef={input => (this.description = input)} placeholder="Package Description" />
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
    )
  }

}

export default AddonAdd;
