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
class AdvertisementAdd extends Component {

  constructor(props){
    super(props)
    this.advertisementName = React.createRef(),
    this.description = React.createRef(),
    this.redirectURL = React.createRef(),
    this.image = React.createRef(),

    
    this.state = {
      addAdv: {},
      validation:{
        advertisementName: {
          rules: {
            notEmpty: {
              message: 'Advertisement name can\'t be left blank',
              valid: false

            }
          },
          valid: null,
          message: ''
        },
        description:{
          rules: {
            notEmpty: {
              message: 'Advertisement description can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        redirectURL: {
          rules: {
            notEmpty: {
              message: 'redirectURL can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        image: {
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
      let addAdv = this.state.validation;
      addAdv[field].valid = null;
      for(let fieldCheck in this.state.validation[field].rules){
        switch(fieldCheck){
          case 'notEmpty':
            if(lastValidFieldFlag === true && this[field].value.length === 0){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addAdv[field].valid = false;
                addAdv[field].message = addAdv[field].rules[fieldCheck].message;

             }
            break;
          
        }
      }
      this.setState({ validation: addAdv});
    }
    if(formSubmitFlag){
      let addAdv = this.state.addAdv;
      addAdv.advertisementName = this.advertisementName.value;
      addAdv.description = this.description.value;
      addAdv.redirectURL = this.redirectURL.value;
      addAdv.image = this.image.value;
      axios.post('/advertisement/newAds', addAdv).then(result => {
        if(result.data.code == '200'){
          this.props.history.push('./Advertisements.js');
        }
      })
    }
  }


  render(){
    return (
      <div>
        <Card>
              <CardHeader>
                <strong>New Advertisement Form</strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="advertisementName">Advertisememt Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.advertisementName.valid === false} innerRef={input => (this.advertisementName = input)} placeholder="Advertisement Name" />
                      <FormFeedback invalid={this.state.validation.advertisementName.valid === false}>{this.state.validation.advertisementName.message}</FormFeedback>
                      <FormText color="muted">Enter name for Advertisement</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="description">Description</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.description.valid === false} innerRef={input => (this.description = input)} placeholder="Description" />
                      <FormFeedback invalid={this.state.validation.description.valid === false}>{this.state.validation.description.message}</FormFeedback>
                      <FormText color="muted">Enter description for Advertisement</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="redirectURL">URL</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="url"  pattern="(http|https)://.+" invalid={this.state.validation.redirectURL.valid === false} innerRef={input => (this.redirectURL = input)}  placeholder="URL" required/>
                      <FormText className="help-block">Enter the Redirected URL for the Advertisement</FormText>
                      <FormFeedback invalid={this.state.validation.redirectURL.valid === false}>{this.state.validation.redirectURL.message}</FormFeedback>
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
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="image">File input</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="file" invalid={this.state.validation.image.valid === false} innerRef={input => (this.image = input)} name="image" />
                      <FormFeedback invalid={this.state.validation.image.valid === false}>{this.state.validation.image.message}</FormFeedback>
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

export default AdvertisementAdd;
