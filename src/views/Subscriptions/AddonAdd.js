import React,{ Component }from 'react'
import axios from 'axios'
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


  render(){
    return (
      <div>
        <Card>
              <CardHeader>
                <strong>New Addon Form</strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="title">Package Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.packageName.valid === false} innerRef={input => (this.packageName = input)} placeholder="Package Name" required/>
                      <FormFeedback invalid={this.state.validation.packageName.valid === false}>{this.state.validation.packageName.message}</FormFeedback>
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="description">Description</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="textarea" invalid={this.state.validation.description.valid === false} innerRef={input => (this.description = input)} placeholder="Description" required/>
                      <FormFeedback invalid={this.state.validation.description.valid === false}>{this.state.validation.description.message}</FormFeedback>
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="author">Price</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="number"  invalid={this.state.validation.price.valid === false} innerRef={input => (this.price = input)}  placeholder="Price" required/>
                      
                      <FormFeedback invalid={this.state.validation.price.valid === false}>{this.state.validation.price.message}</FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="author">Total Trade Permitted</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="number"  invalid={this.state.validation.totalTradePermitted.valid === false} innerRef={input => (this.totalTradePermitted = input)}  placeholder="Tptal Trade permitted" required/>
                      
                      <FormFeedback invalid={this.state.validation.totalTradePermitted.valid === false}>{this.state.validation.totalTradePermitted.message}</FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="author">Total Inventory Allowed</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="number"  invalid={this.state.validation.totalInventoryAllowed.valid === false} innerRef={input => (this.totalInventoryAllowed = input)}  placeholder="Total Inventory Allowed" required/>
                      
                      <FormFeedback invalid={this.state.validation.totalInventoryAllowed.valid === false}>{this.state.validation.totalInventoryAllowed.message}</FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="Status">Status</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <select innerRef={input => (this.status = input)} id="status" class="form-control" >
					  <option value="1">Active</option>
					  <option value="0">Inactive</option>					
                  </select>
                    </Col>
                  </FormGroup>                    
                </Form>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary"  onClick={(e)=>this.submitHandler(e)}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </CardFooter>
            </Card>
        
      </div>
    )
  }

}

export default AddonAdd;
