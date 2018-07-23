import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
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

// a select with dynamically created options
	var options = []
// import PropTypes from 'prop-types';
class CategoryEdit extends Component {
  constructor(props){
    super(props);
    this.title = React.createRef();
    this.description = React.createRef();
    this.parent = React.createRef();
    this.status = React.createRef();
    let categoryId = this.props.match.params.id;
    
	
	
    this.state = {
      categoryId: categoryId,
      categoryForm: {
        title: {
          elementType: "input",
          elementConfig: {
            type: "text",
            placeholder: "Title"
          },
          value: "",
          label: "Title",
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        description: {
          elementType: "input",
          elementConfig: {
            type: "textarea",
            placeholder: "Description"
          },
          value: "",
          label: "Description",
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        parent: {
          elementType: "select",
          elementConfig: {
            options: []
          },
          value: "",
          label: "Parent",
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
    const updatedCategory = {
      ...this.state.categoryForm
    };
    const updatedFormElement = {
      ...updatedCategory[inputIdentifier]
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true;
    updatedCategory[inputIdentifier] = updatedFormElement;
    this.setState({ categoryForm: updatedCategory });
  };
  handleTreeChange(e, data, inputIdentifier) {
    const updatedCategory = {
      ...this.state.categoryForm
    };
    const updatedFormElement = {
      ...updatedCategory[inputIdentifier]
    };
    if (updatedFormElement.value != data.selected) {
      updatedFormElement.value = data.selected;
      updatedFormElement.valid = this.checkValidity(
        updatedFormElement.value,
        updatedFormElement.validation
      );
      updatedFormElement.touched = true;
      updatedCategory[inputIdentifier] = updatedFormElement;
      this.setState(oldState => {
        if (oldState.categoryForm[inputIdentifier].value != data.selected)
          return { categoryForm: updatedCategory };
        return false;
      });
    }
  }
  cancelHandler(){
    this.props.history.push("/categories");
  }

   submitHandler(e){
      e.preventDefault();
      let formSubmitFlag = true;
      for (let field in this.state.validation) {
        let lastValidFieldFlag = true;
        let addCategory = this.state.validation;
        addCategory[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  addCategory[field].valid = false;
                  addCategory[field].message = addCategory[field].rules[fieldCheck].message;

               }
              break;
            case 'emailCheck':
              if(lastValidFieldFlag === true && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this[field].value)){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addCategory[field].valid = false;
                addCategory[field].message = addCategory[field].rules[fieldCheck].message;
              }
              break;
            case 'minLength':
              if(lastValidFieldFlag === true && this[field].value.length < parseInt(this.state.validation[field].rules[fieldCheck].length)){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addCategory[field].valid = false;
                addCategory[field].message = addCategory[field].rules[fieldCheck].message;
              }
              break;
            case 'matchWith':
              if(lastValidFieldFlag === true && this[field].value !== this[this.state.validation[field].rules[fieldCheck].matchWithField].value){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addCategory[field].valid = false;
                addCategory[field].message = addCategory[field].rules[fieldCheck].message;
              }
              break;
          }
        }
        this.setState({ validation: addCategory});
      }

      if(formSubmitFlag){
        let editCategory = this.state.editCategory;
        editCategory.title = this.title.value;
        editCategory.description = this.description.value;
        editCategory.parent = this.parent.value;
        editCategory.status = this.status.value;
        console.log('dddddddd',editCategory);
        axios.put('/category/updateCategory',editCategory).then(result => {
			console.log('dddddddd',result);
          if(result.data.code == '200'){
            this.props.history.push("/categories");
          }
        });
      }
    });
  }

  componentDidMount() {	  
	  //this.props.reference.value = this.props.value;
    axios
      .get("/category/categories")
      .then(result => {
        if (result.data.code === 200) {
          let oldState = this.state.categoryForm;
          oldState.parent.elementConfig.options = result.data.result.filter((cat)=> (cat._id !== this.state.categoryId));
          this.setState(
            {
              categoryForm: oldState
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
      axios.get('/category/viewCategory/' + this.state.categoryId).then(result => {
		  console.log("category",result)
        if(result.data.code == '200'){
          //localStorage.setItem('jwtToken', result.data.result.accessToken);
          let categoryForm = this.state.categoryForm;
          for (let key in categoryForm) {
			  categoryForm[key].value = result.data.result[key];
		  }
		  this.setState({categoryForm: categoryForm});
|
          this.setState({ editCategory: result.data.result});
          this.title.value = result.data.result.title;
          this.description.value = result.data.result.description;
          this.parent.value = result.data.result.parent;
          this.status.value = result.data.result.status;
          

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
    for (let key in this.state.categoryForm) {
      formElementsArray.push({
        id: key,
        config: this.state.categoryForm[key]
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
                <strong>Add Category</strong>
              </CardHeader>

              <CardBody>{form}</CardBody>

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
export default CategoryEdit;
