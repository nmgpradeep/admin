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
class SizeEdit extends Component {
  constructor(props){
    super(props);
    this.size = React.createRef();
    this.category = React.createRef();
    let sizeId = this.props.match.params.id;
    this.state = {
      editSize: {},
      sizeId: sizeId,
      validation:{
        size:{
          rules: {
            notEmpty: {
              message: 'Size field can\'t be left blank',
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
    this.props.history.push("/size");
  }
  submitHandler(e){
      e.preventDefault();
      let formSubmitFlag = true;
      for (let field in this.state.validation) {
        let lastValidFieldFlag = true;
        let addSize = this.state.validation;
        addSize[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  addSize[field].valid = false;
                  addSize[field].message = addSize[field].rules[fieldCheck].message;

               }
              break;
          }
        }
        this.setState({ validation: addSize});
      }

      if(formSubmitFlag){
        let editSize = this.state.editSize;
        editSize.size = this.size.value;
        editSize.category = this.category.value;
        console.log("editSize",editSize)
        axios.put('/size/updateSize', editSize).then(result => {
          if(result.data.code ===200){
            this.props.history.push("/size");
          }
        });
      }
  }

  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/size/viewSize/' + this.state.sizeId).then(result => {
       // console.log(result); 
         if(result.data.code === 200){
        //   //localStorage.setItem('jwtToken', result.data.result.accessToken);
           this.setState({ editSize: result.data.result});
          
           this.size.value = result.data.result.size;
           this.category.value = result.data.result.category;
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
                <strong>Size</strong>
                <small> Edit</small>
                <Link to="/size" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
              
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label >Sizes</Label>
                      <Input type="number" innerRef={input => (this.size = input)} />

                      {/* <FormFeedback invalid={this.state.validation.advertisementName.valid === false}>{this.state.validation.advertisementName.message}</FormFeedback> */}

                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                     <FormGroup>
					  <Label htmlFor="category">Category</Label>
					   <select innerRef={input => (this.category = input)} id="select" class="form-control" >
						  <option value="0">Please select</option>
						  <option value="1">Mobiles</option>
						  <option value="2">Television</option>
						  <option value="3">Washing Machines</option>
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
export default SizeEdit;
