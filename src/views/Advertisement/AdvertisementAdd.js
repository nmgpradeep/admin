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

var FD = require('form-data');
var fs = require('fs');

class AdvertisementAdd extends Component {

  constructor(props){
    super(props)
    this.advertisementName = React.createRef(),
    this.description = React.createRef(),
    this.redirectURL = React.createRef(),
    this.image = React.createRef(),
    this.status = React.createRef(),

    
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
      }
    } 
  }

  fileChangedHandler = (event) => {
    this.setState({selectedFile: event.target.files[0]})
  }
  cancelHandler(){
    this.props.history.push("/advertisement");
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
      const data =new FD()
      data.append('advertisementName', this.advertisementName.value),
      data.append('description', this.description.value),
      data.append('redirectURL', this.redirectURL.value),
      data.append('status', this.status.value),
      //data.append('image', this.state.selectedFile, this.state.selectedFile.name)
      data.append('image', this.state.selectedFile)

      // let addAdv = this.state.addAdv;
      // addAdv.advertisementName = this.advertisementName.value;
      // addAdv.description = this.description.value;
      // addAdv.redirectURL = this.redirectURL.value;
      // addAdv.image = this.image.value;
      //console.log('asdasdfasfasfdasdf',data);
      axios.post('/advertisement/newAds', data).then(result => {
        if(result.data.code ==200){
          this.props.history.push('/advertisement');
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
                <Link to="/advertisement" className="btn btn-success btn-sm pull-right">Back</Link>
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
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="description">Description</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="textarea" invalid={this.state.validation.description.valid === false} innerRef={input => (this.description = input)} placeholder="Description" />
                      <FormFeedback invalid={this.state.validation.description.valid === false}>{this.state.validation.description.message}</FormFeedback>
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="redirectURL">URL</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="url"  pattern="(http|https)://.+" invalid={this.state.validation.redirectURL.valid === false} innerRef={input => (this.redirectURL = input)}  placeholder="URL" />
                      
                      <FormFeedback invalid={this.state.validation.redirectURL.valid === false}>{this.state.validation.redirectURL.message}</FormFeedback>
                    </Col>
                  </FormGroup>
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="image">Advertisement Image</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="file" innerRef={input => (this.image = input)} onChange={this.fileChangedHandler} name="Image" />
                      {/* <FormFeedback invalid={this.state.validation.image.valid === false}>{this.state.validation.image.message}</FormFeedback> */}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="Status">Status</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <Input type="select" innerRef={input => (this.status = input)} id="status" className="form-control" >
					  <option value="0">Active</option>
					  <option value="1">Inactive</option>					
					</Input>                         
                    </Col>
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
        
      </div>
    )
  }

}

export default AdvertisementAdd;
