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
  }
  handleContentChange(value) {	  
    this.setState({ text: value })
    
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
		console.log('IMAGE', this.bannerImage.files[0]);
		const data = new FD();
		//console.log('FORM DATA START', this.pageTitle.value);
		data.append('pageTitle', fs.createReadStream(this.pageTitle.value));
		data.append('pageHeading', fs.createReadStream(this.pageHeading.value));
		data.append('description', fs.createReadStream(this.state.text));
		data.append('bannerImage', fs.createReadStream(this.bannerImage.files[0]));
				console.log("data",data);
		let options = {
		method: 'POST',
			url: 'http://localhost:5001/cmsPage/upload',
		headers: {
			'Content-Type': `multipart/form-data; boundary=${data._boundary}`
		},
		data
		};

		return axios(options)
		.then(response => {
			console.log(response);
		});
	
        let newPage = this.state.newPage;
        newPage.pageTitle = this.pageTitle.value;
        newPage.pageHeading = this.pageHeading.value;
        newPage.description = this.state.text;
        newPage.bannerImage = this.bannerImage.files[0];   
        let axiosConfig = {
		  headers: {
			  'Content-Type': 'multipart/form-data'
		  }
		};
        axios.post('/page/newPage', newPage, axiosConfig).then(result => {
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
                <small></small>
              </CardHeader>
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
                      <Label htmlFor="lastname">Banner Image</Label>
                      <Input type="file" innerRef={input => (this.bannerImage = input)} placeholder="Banner Image" />
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
