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
class CategoryEdit extends Component {
  constructor(props){
    super(props);
    this.title = React.createRef();
    this.description = React.createRef();
    this.parent = React.createRef();
    this.status = React.createRef();
    let categoryId = this.props.match.params.id;
    this.state = {
      editCategory: {},
      categoryId: categoryId,
      validation:{
        title:{
          rules: {
            notEmpty: {
              message: 'Category name field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        description:{
          rules: {
            notEmpty: {
              message: 'Category description field can\'t be left blank',
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
  }

  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/category/viewCategory/' + this.state.categoryId).then(result => {
        if(result.data.code == '200'){
          //localStorage.setItem('jwtToken', result.data.result.accessToken);
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
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Category</strong>
                <small> Edit</small>
              </CardHeader>
              <CardBody>
              <Form noValidate>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Category Name</Label>
                      <Input type="text" invalid={this.state.validation.title.valid === false} innerRef={input => (this.title = input)} placeholder="Category Name" />

                      <FormFeedback invalid={this.state.validation.title.valid === false}>{this.state.validation.title.message}</FormFeedback>

                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">Description</Label>
                      <Input type="textarea" innerRef={input => (this.description = input)} placeholder="Description" />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                     <FormGroup>
					  <Label htmlFor="parent">Parent</Label>
					   <select innerRef={input => (this.parent = input)} id="select" class="form-control" >
						  <option value="0">Please select</option>
						  <option value="1">Samsung</option>
						  <option value="2">Television</option>
						  <option value="3">Nokia</option>
					  </select>
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
export default CategoryEdit;
