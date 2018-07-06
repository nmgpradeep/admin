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
    //this.handleContentChange = this.handleContentChange.bind(this)
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
        let editPage = this.state.editPage;
        editPage.pageTitle = this.pageTitle.value;
        editPage.pageHeading = this.pageHeading.value;
        
        axios.post('/page/updatePage', editPage).then(result => {
			//console.log(result);
         if(result.data.status == '200'){
            this.props.history.push("/users");
          }
        });
      }
    } 

   componentDidMount() {   
      axios.get('/page/viewPage/' + this.state.pageId).then(result => {		  
        if(result.data.code == '200'){
          this.pageTitle.value = result.data.result.pageTitle;
          this.pageHeading.value = result.data.result.pageHeading;
          this.bannerImage.value = result.data.result.bannerImage;         
          this.description.value = result.data.result.description;  
          this.setState({ text: result.data.result.description })
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
                  </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="content">Contents</Label>
                    <ReactQuill  innerRef={input => (this.description = input)}   value={this.state.text || ''} onChange={this.handleChange}
                   />
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
