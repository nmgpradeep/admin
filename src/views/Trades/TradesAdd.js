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
class TradeAdd extends Component {

  constructor(props){
    super(props)
    this.sellerId = React.createRef(),
    this.receiverId = React.createRef(),
    this.sellerProductId = React.createRef(),
    this.receiverProductId = React.createRef(),

    
    this.state = {
    addTrade: {},
      validation:{
        sellerId: {
          rules: {
            notEmpty: {
              message: 'Advertisement name can\'t be left blank',
              valid: false

            }
          },
          valid: null,
          message: ''
        },
        receiverId:{
          rules: {
            notEmpty: {
              message: 'Advertisement description can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        sellerProductId: {
          rules: {
            notEmpty: {
              message: 'redirectURL can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        receiverProductId: {
          rules: {
            notEmpty: {
              message: 'Please provide a image for the advertisement',
              valid: false
            }
          },
          valid: null,
          message: ''
        }


      }
    } 
  }

  submitHandler(e){
    e.preventDefault()
    let formSubmitFlag = true;
    for (let field in this.state.validation) {
      let lastValidFieldFlag = true;
      let addTrade = this.state.validation;
      addTrade[field].valid = null;
      for(let fieldCheck in this.state.validation[field].rules){
        switch(fieldCheck){
          case 'notEmpty':
            if(lastValidFieldFlag === true && this[field].value.length === 0){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addTrade[field].valid = false;
                addTrade[field].message = addTrade[field].rules[fieldCheck].message;

             }
            break;
          
        }
      }
      this.setState({ validation: addTrade});
    }
    if(formSubmitFlag){
      let addTrade = this.state.addTrade;
      addTrade.sellerId = this.sellerId.value;
      addTrade.receiverId = this.receiverId.value;
      addTrade.sellerProductId = this.sellerProductId.value;
      addTrade.receiverProductId = this.receiverProductId.value;
      axios.post('/trade/newTrade', addTrade).then(result => {
        if(result.data.code == '200'){
          this.props.history.push('./trades');
        }
      })
    }
  }


  render(){
    return (
      <div>
        <Card>
              <CardHeader>
                <strong>New Trade Form</strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="advertisementName">sellerId</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.sellerId.valid === false} innerRef={input => (this.sellerId = input)} placeholder="Advertisement Name" />
                      <FormFeedback invalid={this.state.validation.sellerId.valid === false}>{this.state.validation.sellerId.message}</FormFeedback>
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="description">receiverId</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.receiverId.valid === false} innerRef={input => (this.receiverId = input)} placeholder="Description" />
                      <FormFeedback invalid={this.state.validation.receiverId.valid === false}>{this.state.validation.receiverId.message}</FormFeedback>
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="redirectURL">sellerProductId</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text"   invalid={this.state.validation.sellerProductId.valid === false} innerRef={input => (this.sellerProductId = input)}  placeholder="URL" required/>
                      
                      <FormFeedback invalid={this.state.validation.sellerProductId.valid === false}>{this.state.validation.sellerProductId.message}</FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="redirectURL">receiverProductId</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text"   invalid={this.state.validation.receiverProductId.valid === false} innerRef={input => (this.receiverProductId = input)}  placeholder="URL" required/>
                      
                      <FormFeedback invalid={this.state.validation.receiverProductId.valid === false}>{this.state.validation.receiverProductId.message}</FormFeedback>
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

export default TradeAdd;
