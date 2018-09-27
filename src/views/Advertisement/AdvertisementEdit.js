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

var FD = require('form-data');
var fs = require('fs');

// import PropTypes from 'prop-types';
class AdvertisementEdit extends Component {
  constructor(props){
    super(props);
    this.advertisementName = React.createRef();
    this.description = React.createRef();
    this.redirectURL = React.createRef();
    this.image = React.createRef();
    let advId = this.props.match.params.id;
    this.state = {
      editAdv: {},
      advId: advId,
      validation:{
        advertisementName:{
          rules: {
            notEmpty: {
              message: 'Advertisement name field can\'t be left blank',
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
        redirectURL: {
          rules: {
            notEmpty: {
              message: 'URL field can\'t be left blank',
              valid: false
            },
          },
          valid: null,
          message: ''
        }
      }
    };
  }
  fileChangedHandler = (event) => {
	  this.setState({selectedFile: event.target.files[0]})
   }
  cancelHandler(){
    this.props.history.push("/advertisement");
  }
  submitHandler(e){
      e.preventDefault();
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
        const data = new FD()
        data.append('_id', this.state.advId)
        data.append('advertisementName', this.advertisementName.value)
        data.append('description', this.description.value)
        data.append('redirectURL', this.redirectURL.value)
        if(this.state.selectedFile){
          //data.append('image', this.state.selectedFile, this.state.selectedFile.name)
          data.append('image', this.state.selectedFile)
         } else {
          data.append('image', this.state.editAdv.image);
       }	
        // let editAdv = this.state.editAdv;
        // editAdv.advertisementName = this.advertisementName.value;
        // editAdv.description = this.description.value;
        // editAdv.redirectURL = this.redirectURL.value;
        // editAdv.image = this.image.value;
        console.log("editAdv",data)
        axios.put('/advertisement/updateAds', data).then(result => {
          if(result.data.code ===200){
            this.props.history.push("/advertisement");
          }
        });
      }
  }

  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/advertisement/viewAds/' + this.state.advId).then(result => {
       // console.log(result); 
         if(result.data.code === 200){
        //   //localStorage.setItem('jwtToken', result.data.result.accessToken);
           this.setState({ editAdv: result.data.result});
          
           this.advertisementName.value = result.data.result.advertisementName;
           this.description.value = result.data.result.description;
           this.redirectURL.value = result.data.result.redirectURL;
           this.image.value = result.data.result.image;
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
                <strong>Advertisement</strong>
                <small> Edit</small>
                <Link to="/advertisement" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
              
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label >Advertisement Name</Label>
                      <Input type="text" innerRef={input => (this.advertisementName = input)}   placeholder="Advertisement name" />

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
                      <Label htmlFor="lastname">URL</Label>
                      <Input type="url"  pattern="(http|https)://.+" innerRef={input => (this.redirectURL = input)} placeholder="URL" />
                    </FormGroup>
                  </Col>
                </Row>
                <Col xs="4" sm="12">
						<FormGroup>
						 <Label htmlFor="brand">Image</Label>                  
						  <Input type="file" innerRef={input => (this.image = input)} onChange={this.fileChangedHandler} placeholder="Advertisement Image" /> 	
						  <img src={'assets/uploads/AdvertisementImage/'+this.state.editAdv.image} width="60"/>
					   </FormGroup>
                   </Col>
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
export default AdvertisementEdit;
