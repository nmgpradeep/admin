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
class CategoryAdd extends Component {
  constructor(props){
    super(props);
    this.categoryName = React.createRef();
    this.description = React.createRef();
    this.parent = React.createRef();
    this.status = React.createRef();
    this.state = {
      addCategory: {},
      validation:{
        categoryName:{
          rules: {
            notEmpty: {
              message: 'Category name field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        }
      }
    };
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
                  addCategory[field].message = addCategory[field].addCategory[fieldCheck].message;

               }
              break;
          }
        }
        this.setState({ validation: addCategory});
      }
      if(formSubmitFlag){
        let addCategory = this.state.addCategory;
        addCategory.categoryName = this.categoryName.value;
        addCategory.description = this.description.value;
        addCategory.parent = this.parent.value;
        addCategory.status = this.status.value;
        axios.post('/category/create', addCategory).then(result => {
          if(result.data.code == '200'){
            this.props.history.push("/categories");
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
                <strong>Add Category</strong>
              </CardHeader>
              <CardBody>
              <Form noValidate>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Name</Label>
                      <Input type="text" invalid={this.state.validation.categoryName.valid === false} innerRef={input => (this.categoryName = input)} placeholder="Category Name" />

                      <FormFeedback invalid={this.state.validation.categoryName.valid === false}>{this.state.validation.categoryName.message}</FormFeedback>

                    </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="description">Description</Label>
                  <Input type="textarea" innerRef={input => (this.description = input)} placeholder="Description" />

                </FormGroup>

                <FormGroup>
                  <Label htmlFor="parent">Parent</Label>
                   <select innerRef={input => (this.parent = input)} id="select" className="form-control" >
					  <option value="0">Please select</option>
					  <option value="1">Samsung</option>
					  <option value="2">Television</option>
					  <option value="3">Nokia</option>
                  </select>

                </FormGroup>

                 <FormGroup>
                  <Label htmlFor="status" >Status</Label>
                  <select innerRef={input => (this.status = input)} id="status" className="form-control" >
					  <option value="1">Active</option>
					  <option value="0">Inactive</option>
                  </select>


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
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default CategoryAdd;
