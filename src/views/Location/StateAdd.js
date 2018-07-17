import React,{ Component }from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios'
import StateSelectBox from '../SelectBox/StateSelectBox/StateSelectBox'
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
class StateAdd extends Component {

  constructor(props){
    super(props)
    this.country = React.createRef(),
    this.stateName = React.createRef(),
    
    this.state = {
      addState: {},
      countrys : '',
      validation:{
        country: {
          rules: {
            notEmpty: {
              message: 'Country name can\'t be left blank',
              valid: false

            }
          },
          valid: null,
          message: ''
        },
        stateName:{
          rules: {
            notEmpty: {
              message: 'State name can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
      }
    } 
  }

  handleCountry = (countrys) => {
        this.setState({countrys: countrys});
  }
    
  submitHandler(e){
    e.preventDefault()
    let formSubmitFlag = true;
    for (let field in this.state.validation) {
      let lastValidFieldFlag = true;
      let addState = this.state.validation;
      addState[field].valid = null;
      for(let fieldCheck in this.state.validation[field].rules){
        //~ switch(fieldCheck){
          //~ case 'notEmpty':
            //~ if(lastValidFieldFlag === true && this[field].value.length === 0){
                //~ lastValidFieldFlag = false;
                //~ formSubmitFlag = false;
                //~ addTestimonial[field].valid = false;
                //~ addTestimonial[field].message = addTestimonial[field].rules[fieldCheck].message;

             //~ }
            //~ break;
          
        //~ }
      }
      this.setState({ validation: addState});
    }
    if(formSubmitFlag){
	console.log("COUNTRYS",this.state.countrys)
      let addState = this.state.addState;
      addState.country = this.state.countrys;
      addState.stateName = this.stateName.value;
      console.log("addState",addState)
      axios.post('/location/newState', addState  ).then(result => {
        if(result.data.code == '200'){
          this.props.history.push('./State');
        }
      })
    }
  }


  render(){
    return (
      <div>
        <Card>
              <CardHeader>
                <strong>New State Form</strong>
                <Link to="/state" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="author">Country Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <StateSelectBox onSelectCountry={this.handleCountry}/>
                    </Col>
                  </FormGroup>
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="description">State Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.stateName.valid === false} innerRef={input => (this.stateName = input)} placeholder="Description" required/>
                      <FormFeedback invalid={this.state.validation.stateName.valid === false}>{this.state.validation.stateName.message}</FormFeedback>
                      
                    </Col>
                  </FormGroup>
                  {/*<FormGroup row>
                    <Col md="3">
                      <Label htmlFor="author">Author</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text"  invalid={this.state.validation.author.valid === false} innerRef={input => (this.author = input)}  placeholder="Author" required/>
                      
                      <FormFeedback invalid={this.state.validation.author.valid === false}>{this.state.validation.author.message}</FormFeedback>
                    </Col>
                  </FormGroup> */}
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="Status">Status</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <select innerRef={input => (this.status = input)} id="status" className="form-control" >
					  <option value="1">Active</option>
					  <option value="0">Inactive</option>					
                  </select>
                    </Col>
                  </FormGroup>                    
                </Form>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary"  onClick={(e)=>this.submitHandler(e)}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </CardFooter>
            </Card>
        
      </div>
    )
  }

}

export default StateAdd;
