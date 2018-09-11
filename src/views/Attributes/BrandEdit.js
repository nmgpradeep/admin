import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import CategorySelectBox from '../SelectBox/CategorySelectBox/CategorySelectBox'
import InputElement from "../InputElement/InputElement";

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
class BrandEdit extends Component {
  constructor(props){
    super(props);
    this.brandName = React.createRef();
    this.category = React.createRef();
    let brandId = this.props.match.params.id;
     this.state = {
      brandId: brandId,
      brandForm: {
        brandName: {
          elementType: "input",
          elementConfig: {
            type: "text",
            placeholder: "Brand Name"
          },
          value: "",
          label: "Brand Name",
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
         category: {
          elementType: "select",
          elementConfig: {
            options: []
          },
          value: "",
         // value :{(this.state.editProduct.brand)?this.state.editProduct.brand._id:''}
          label: "Category",
          validation: {
            required: false
          },
          valid: true,
          touched: false
        }
      }
    };
  }

  
  checkValidity(value, rules) {
    let isValid = false;
    if (rules.required) {
      isValid = value.trim() != "" && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }
    return isValid;
  }
   inputChangedHandler = (event, inputIdentifier) => {
    const updatedBrand = {
      ...this.state.brandForm
    };
    const updatedFormElement = {
      ...updatedBrand[inputIdentifier]
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true;
    updatedBrand[inputIdentifier] = updatedFormElement;
    this.setState({ brandForm: updatedBrand });
  };
  handleTreeChange(e, data, inputIdentifier) {
    const updatedBrand = {
      ...this.state.brandForm
    };
    const updatedFormElement = {
      ...updatedBrand[inputIdentifier]
    };
    if (updatedFormElement.value != data.selected) {
      updatedFormElement.value = data.selected;
      updatedFormElement.valid = this.checkValidity(
        updatedFormElement.value,
        updatedFormElement.validation
      );
      updatedFormElement.touched = true;
      updatedBrand[inputIdentifier] = updatedFormElement;
      this.setState(oldState => {
        if (oldState.brandForm[inputIdentifier].value != data.selected)
          return { brandForm: updatedBrand };
        return false;
      });
    }
  }

  cancelHandler(){
    this.props.history.push("/brand");
  }
  
  submitHandler(e){
      e.preventDefault();
      let formSubmitFlag = true;
      if(formSubmitFlag){        
        let editBrand = this.state.editBrand;
         let brandObj = {_id: this.state.brandId};
			for (let key in this.state.brandForm) {
			  brandObj[key] = this.state.brandForm[key].value;
			}
           axios.put('/brand/updatebrand', brandObj).then(result => {
          if(result.data.code ===200){
            this.props.history.push("/brand");
          }
        });
      }
  }

  componentDidMount() {
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
       axios.get("/category/allCategories")
      .then(result => {
        if (result.data.code === 200) {
          let oldState = this.state.brandForm;
          oldState.category.elementConfig.options = result.data.result.filter((cat)=> (cat._id !== this.state.category));
          this.setState(
            {
              brandForm: oldState
            }
          );
        }
      })
      .catch(error => {
        console.log("ERROR", error);
        if (error.status === 401) {
          this.props.history.push("/login");
        }
      });  
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/brand/viewBrand/' + this.state.brandId).then(result => {
        if(result.data.code == '200'){
          console.log('view dddddddddddd',result.data.result);
          let brandForm = this.state.brandForm;
          for (let key in brandForm) {
			  //~ if(key === 'category'){
				  //~ brandForm[key].value = result.data.result[key]._id;
			  //~ }else{
				  brandForm[key].value = result.data.result[key];
			  //~ }
		  }
		  console.log('brandForm', brandForm);
		  this.setState({brandForm: brandForm});
        }
      })
      .catch((error) => {
        if(error.status === 401) {
          this.props.history.push("/login");
        }
      });

  }
  render() {
	const formElementsArray = [];
    for (let key in this.state.brandForm) {
      formElementsArray.push({
        id: key,
        config: this.state.brandForm[key]
      });
    }
    console.log("Form elements", formElementsArray);
    let form = (
      <Form noValidate>
        {formElementsArray.map(formElement => (
          <Row key={formElement.id}>
            <Col xs="4" sm="12">
              <InputElement
                key={formElement.id}
                label={formElement.config.label}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                changed={event =>
                  this.inputChangedHandler(event, formElement.id)
                }
                treechanged={(event, data) => {
                  return this.handleTreeChange(event, data, formElement.id);
                }}
                value={formElement.config.value}
              />
            </Col>
          </Row>
        ))}
        <Row>
          <Col xs="6" className="text-right">
            <Button
              onClick={e => this.submitHandler(e)}
              color="success"
              className="px-4"
            >
              Submit
            </Button>
          </Col>
          <Col xs="6">
            <Button
              onClick={() => this.cancelHandler()}
              color="primary"
              className="px-4"
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    );
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Brand</strong>
                <small> Edit</small>
                <Link to="/brand" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
                <Row>
                   <CardBody>{form}</CardBody>
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
export default BrandEdit;
