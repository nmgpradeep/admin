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
class CmsPageEdit extends Component {
  constructor(props){
    super(props);
    this.pageTitle = React.createRef();
    this.pageHeading = React.createRef();
    this.description = React.createRef();
    this.bannerImage = React.createRef();
    let pageId = this.props.match.params.id;

    this.state = {
      editPage: {},
      pageId: pageId,
      text: '',
      bannerImage :'',
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

  fileChangedHandler = (event) => {
	  this.setState({selectedFile: event.target.files[0]})
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
        let editPage = this.state.validation;
        editPage[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  editPage[field].valid = false;
                  editPage[field].message = editPage[field].rules[fieldCheck].message;
               }
              break;
               }
        }
        this.setState({ validation: editPage});
      }

      if(formSubmitFlag){
        const data = new FD();
		console.log('FORM DATA START', this.pageTitle.value);
		data.append('_id', this.state.pageId)
		data.append('pageTitle', this.pageTitle.value);
		data.append('pageHeading', this.pageHeading.value);
		data.append('description', this.state.text);
		//console.log("data",data)
		//console.log("this.description.value",this.description.value)
		//console.log("this.description.value", this.state.text)
		if(this.state.selectedFile){
		  //data.append('bannerImage', this.state.selectedFile, this.state.selectedFile.name)
      data.append('bannerImage', this.state.selectedFile)
		 } else {
		  data.append('bannerImage', this.state.editPage.bannerImage);
	   }
        // let editPage = this.state.editPage;
        // editPage.pageTitle = this.pageTitle.value;
        // editPage.pageHeading = this.pageHeading.value;
        // editPage.description = this.description.value;
        console.log("editPage", data)
        axios.put('/page/updatePage', data).then(result => {
         if(result.data.code === 200){
            this.props.history.push("/pages");
          }
        });
      }
    }

   componentDidMount() {
      axios.get('/page/viewPage/' + this.state.pageId).then(result => {
        if(result.data.code === 200){
          console.log('page details', result.data.result)
		   this.setState({ editPage: result.data.result});
			this.pageTitle.value = result.data.result.pageTitle;
			this.pageHeading.value = result.data.result.pageHeading;
			this.setState({ bannerImage: result.data.result.bannerImage});
			this.setState({ text: result.data.result.description});
          //~ this.setState((oldState) => ({ text: 'TYETTTETETETET' }), function(){
			//~ alert(this.state.text);
		  //~ })
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
                <strong>Page</strong>
                <small> Edit</small>
              </CardHeader>
              <CardBody>
              <Form noValidate>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Page Title</Label>
                      <Input type="text" innerRef={input => (this.pageTitle = input)}  placeholder="Page Title" />

                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">Page Heading</Label>
                      <Input type="text" innerRef={input => (this.pageHeading = input)}  placeholder="Page Heading" />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                      {/* <FormGroup>
                      <Label htmlFor="lastname">Banner Image</Label>
                      <Input type="file" innerRef={input => (this.bannerImage = input)} placeholder="Banner Image" />
                    </FormGroup> */}
                    <FormGroup>
						 <Label htmlFor="brand">Banner Image</Label>
						  <Input type="file" innerRef={input => (this.bannerImage = input)} onChange={this.fileChangedHandler} placeholder="Banner Image" />
						  <img src={'assets/uploads/cmsPageImage/'+this.state.editPage.bannerImage} width="60"/>
					   </FormGroup>

                  </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="content">Contents</Label>
                    <ReactQuill defaultValue={this.state.editorHtml} innerRef={input => (this.description = input)}   value={this.state.text || ''} onChange={this.handleContentChange}/>
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
export default CmsPageEdit;
