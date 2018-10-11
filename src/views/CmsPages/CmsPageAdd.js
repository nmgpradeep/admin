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

import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
var FD = require('form-data');
var fs = require('fs');
// import PropTypes from 'prop-types';
class CmsPageAdd extends Component {
  constructor(props){
    super(props);
    this.pageTitle = React.createRef();
    this.pageHeading = React.createRef();
    this.description = React.createRef();
    this.bannerImage = React.createRef();

    this.state = {
      newPage: {},
      text: '',
      selectedFile: null,
      validation:{
        pageTitle:{
          rules: {
            notEmpty: {
              message: 'Page Title field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        pageHeading:{
          rules: {
            notEmpty: {
              message: 'Page Heading field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        }
      }
    };
     this.handleContentChange = this.handleContentChange.bind(this)
      this.fileChangedHandler = this.fileChangedHandler.bind(this)
  }
  handleContentChange(value) {
    this.setState({ text: value })
  }

  fileChangedHandler = (event) => {
	  this.setState({selectedFile: event.target.files[0]})
  }

  cancelHandler(){
    this.props.history.push("/pages");
  }
  submitHandler(e){
      e.preventDefault();
      let formSubmitFlag = true;
      for (let field in this.state.validation) {
        let lastValidFieldFlag = true;
        let newPage = this.state.validation;
        newPage[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  newPage[field].valid = false;
                  newPage[field].message = newPage[field].rules[fieldCheck].message;
               }
              break;
          }
        }
        this.setState({ validation: newPage});
      }
      if(formSubmitFlag){
		console.log("state",this.state)
		const data = new FD();
		console.log('FORM DATA START', this.pageTitle.value);
		data.append('pageTitle', this.pageTitle.value);
		data.append('pageHeading', this.pageHeading.value);
		data.append('description', this.state.text);
		data.append('bannerImage', this.state.selectedFile)
		console.log("data",data)
        axios.post('/page/newPage', data).then(result => {
			console.log('resultImages ',result);
          if(result.data.code === 200){
            this.props.history.push("/pages");
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
                <strong>New CMS Page</strong>
                <Link to="/pages" className="btn btn-success btn-sm pull-right">Back</Link>              </CardHeader>
              <CardBody>
              <Form noValidate encType="multipart/form-data">
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="pagetitle">Page Title</Label>
                      <Input type="text" invalid={this.state.validation.pageTitle.valid == false} innerRef={input => (this.pageTitle = input)} placeholder="Page Title" />

                      <FormFeedback invalid={this.state.validation.pageTitle.valid === false}>{this.state.validation.pageTitle.message}</FormFeedback>

                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="pageheading">Page Heading</Label>
                      <Input type="text" innerRef={input => (this.pageHeading = input)} placeholder="Page heading" />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="content">Contents</Label>
                      <ReactQuill  innerRef={input => (this.description = input)}  value={this.state.text}
                   onChange={this.handleContentChange} />
                    </FormGroup>
                  </Col>
                   <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="bannerImage">Banner Image</Label>
                      <Input type="file" innerRef={input => (this.bannerImage = input)} onChange={this.fileChangedHandler} placeholder="Banner Image" />
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
export default CmsPageAdd;
