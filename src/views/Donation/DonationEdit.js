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
// import PropTypes from 'prop-types';
class DonationEdit extends Component {
  constructor(props){
    super(props);
    this.productName = React.createRef();
    this.description = React.createRef();
    this.productCategory = React.createRef();
    this.userId  = React.createRef();
    this.size = React.createRef();
    this.color = React.createRef();
    this.brand = React.createRef();
    this.productAge = React.createRef();

    let donationId = this.props.match.params.id;
    this.state = {
      editDonation: {},
      donationId: donationId,
      validation:{
        productName: {
          rules: {
            notEmpty: {
              message: 'Product name can\'t be left blank',
              valid: false

            }
          },
          valid: null,
          message: ''
        },
        description:{
          rules: {
            notEmpty: {
              message: 'Product description can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        size: {
          rules: {
            notEmpty: {
              message: 'size can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        color: {
          rules: {
            notEmpty: {
              message: 'Please provide a color for the product',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        brand: {
            rules: {
              notEmpty: {
                message: 'brand can\'t be left blank',
                valid: false
              }
            },
            valid: null,
            message: ''
          },
          productAge: {
           rules: {
              notEmpty: {
               message: 'Age can\'t be left blank',
                valid: false
              }
            },
            valid: null,
            message: ''
          },
      }
    };
  }
  cancelHandler(){
    this.props.history.push("/donation");
  }
  submitHandler(e){
      e.preventDefault();
      let formSubmitFlag = true;
      for (let field in this.state.validation) {
        let lastValidFieldFlag = true;
        let addDonation = this.state.validation;
        addDonation[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  addDonation[field].valid = false;
                  addDonation[field].message = addDonation[field].rules[fieldCheck].message;

               }
              break;
          }
        }
        this.setState({ validation: addDonation});
      }

      if(formSubmitFlag){
        let editDonation = this.state.editDonation;
        editDonation.productName = this.productName.value;
        editDonation.description = this.description.value;
        editDonation.productCategory = this.productCategory.value;
        editDonation.userId = this.userId.value;
        editDonation.size = this.size.value;
        editDonation.color = this.color.value;
        editDonation.brand = this.brand.value;
        editDonation.productAge = this.productAge.value;
        console.log("editDonation",editDonation)
        axios.put('/donation/updateDonation', editDonation).then(result => {
          if(result.data.code ===200){
            this.props.history.push("/donations");
          }
        });
      }
  }

  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/donation/viewDonation/' + this.state.donationId).then(result => {
       // console.log(result); 
         if(result.data.code === 200){
        //   //localStorage.setItem('jwtToken', result.data.result.accessToken);
           this.setState({ editDonation: result.data.result});
          
           this.productName.value = result.data.result.productName;
           this.description.value = result.data.result.description;
           this.productCategory.value = result.data.result.productCategory;
           this.userId.value = result.data.result.userId;
           this.size.value = result.data.result.size;
           this.color.value = result.data.result.color;
           this.brand.value = result.data.result.brand;
           this.productAge.value = result.data.result.productAge;
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
                <strong>Donation</strong>
                <small> Edit</small>
                <Link to="/donations" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
              
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label >Product Name</Label>
                      <Input type="text" innerRef={input => (this.productName = input)}   placeholder="Product name" />

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
                      <Label htmlFor="lastname">Category</Label>
                      <Input type="text" innerRef={input => (this.productCategory = input)} placeholder="Category" required/>
                    </FormGroup>
                  </Col>
                </Row>
                 <FormGroup>
                  <Label htmlFor="username">userId</Label>
                  <Input type="text" innerRef={input => (this.userId = File)} placeholder="User Id" />
                  {/* <FormFeedback invalid={this.state.validation.image.valid === false}>{this.state.validation.image.message}</FormFeedback> */}
                </FormGroup>
                <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="size">Size</Label>
                      <Input type="text" innerRef={input => (this.size = input)} placeholder="Size" />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="color">Color</Label>
                      <Input type="text" innerRef={input => (this.color = input)} placeholder="color" />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="brand">Brand</Label>
                      <Input type="text" innerRef={input => (this.brand = input)} placeholder="Brand" />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="productAge">Age</Label>
                      <Input type="text" innerRef={input => (this.productAge = input)} placeholder="Age" />
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
export default DonationEdit;
