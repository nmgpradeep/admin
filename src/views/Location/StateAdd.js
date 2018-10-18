import React,{ Component }from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios'
import CountrySelectBox from '../SelectBox/CountrySelectBox/CountrySelectBox'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

class StateAdd extends Component {

  constructor(props){
    super(props)
    this.country = React.createRef(),
    this.stateName = React.createRef(),
    this.status = React.createRef(),
    
    this.state = {
      addState: {},
      country : '',
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

  handleCountry = (country) => {
        this.setState({country: country});
  }
  cancelHandler(){
    this.props.history.push("/state");
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
      let addState = this.state.addState;
      addState.country = this.state.country;
      addState.stateName = this.stateName.value;
      addState.status = this.status.value;
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
                      <CountrySelectBox onSelectCountry={this.handleCountry} />
                    </Col>
                  </FormGroup>
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="statename">State Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.stateName.valid === false} innerRef={input => (this.stateName = input)} placeholder="State Name" required/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="Status">Status</Label>
                    </Col>
                    <Col xs="12" md="9">
                     <Input type="select" innerRef={input => (this.status = input)} id="status" className="form-control" >
					  <option value="0">Active</option>
					  <option value="1">Inactive</option>					
					</Input>
                    </Col>
                  </FormGroup>                    
                </Form>
              </CardBody>
              <CardFooter>
               <div className="row">
					<div className="text-right col-6">
						<Button onClick={(e)=>this.submitHandler(e)} color="success" className="px-4">Submit</Button>
						
					</div>
					<div className="col-6">
					<Button onClick={()=>this.cancelHandler()} color="primary" className="px-4">Cancel</Button>
					</div>
				</div>
              </CardFooter>
            
            </Card>
        
      </div>
    )
  }

}

export default StateAdd;
