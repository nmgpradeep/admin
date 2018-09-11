import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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
  Row
} from "reactstrap";
// import PropTypes from 'prop-types';
class CategoryAdd extends Component {
  constructor(props) {
    super(props);
    this.title = React.createRef();
    this.description = React.createRef();
    this.parent = React.createRef();
    this.status = React.createRef();
    this.tree_data = null;
    this.state = {
	
      addCategory: {},
      message : null,
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
          elementType: "textarea",
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
          elementType: "tree",
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
	  //this.tree_data = data.selected[0];
	  if(e.type == 'changed' && data.node != undefined && data.node.data != undefined){
		this.tree_data = data.node.data._id;
	  }	  
  }
  componentDidMount() {
    axios
      .get("/category/allCategories")
      .then(result => {
        if (result.data.code === 200) {
          let oldState = this.state.categoryForm;
          oldState.parent.elementConfig.options = result.data.result;
          this.setState(
            {
              categoryForm: oldState
            }
          );
        }
        //console.log(this.state.categories);
      })
      .catch(error => {
        console.log("ERROR", error);
        if (error.status === 401) {
          this.props.history.push("/login");
        }
      });
  }
  cancelHandler() {
    this.props.history.push("/categories");
  }
  submitHandler(e) {
    e.preventDefault();
    const updatedCategory = {
      ...this.state.categoryForm
    };
    const updatedFormElement = {
      ...updatedCategory['parent']
    };
    updatedFormElement.value = this.tree_data;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true;
    updatedCategory['parent'] = updatedFormElement;
    this.setState({ categoryForm: updatedCategory }, function(){
		let categoryObj = {};
		for (let key in this.state.categoryForm) {
		  categoryObj[key] = this.state.categoryForm[key].value;
		}
		console.log('FFFFFFF', categoryObj);
		axios.post("/category/create", categoryObj).then(result => {
		  if (result.data.code == "200") {
			this.props.history.push("/categories");
		  }else{
			  this.setState({message : result.data.message});
		 }
		});
		setTimeout(() => {this.setState({message : null})}, 10000)
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
              {(this.state.message && this.state.message !== null)?<div className="alert alert-danger">{this.state.message}</div>:''
		}
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
export default CategoryAdd;
