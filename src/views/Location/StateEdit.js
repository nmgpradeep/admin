import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import CountrySelectBox from '../SelectBox/CountrySelectBox/CountrySelectBox'
import { 
  Button, 
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,  
  FormGroup,  
  Input, 
  Label,
  Row,
} from 'reactstrap';
// import PropTypes from 'prop-types';
class StateEdit extends Component {
  constructor(props){
    super(props);
    this.country = React.createRef();
    this.stateName = React.createRef();
    this.status = React.createRef();
    let stateId = this.props.match.params.id;
    this.state = {
      editState: {},     
      stateId: stateId,
      validation:{
        country:{
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
    };
  }
    
   handleCountry = (country) => {
       this.country.current = country;       
  }
    
  cancelHandler(){
    this.props.history.push("/state");
  }
  submitHandler(e){
      e.preventDefault();
      console.log('in submit', this);
      let formSubmitFlag = true;
      for (let field in this.state.validation) {
        let lastValidFieldFlag = true;
        let addState = this.state.validation;
        addState[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  addState[field].valid = false;
                  addState[field].message = addState[field].rules[fieldCheck].message;

               }
              break;
          }
        }
        this.setState({ validation: addState});
      }

      if(formSubmitFlag){
        let editState = this.state.editState;
        editState.country = this.country.value;
        editState.stateName = this.stateName.value;
        editState.status = this.status.value;
        console.log("editState",editState)
        axios.put('/location/updateState', editState).then(result => {
          if(result.data.code ===200){
            this.props.history.push("/state");
          }
        });
      }
  }

  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/location/viewState/' + this.state.stateId).then(result => {
       // console.log(result); 
         if(result.data.code === 200){
        //localStorage.setItem('jwtToken', result.data.result.accessToken);
           this.setState({ editState: result.data.result});
           
           this.country.value = result.data.result.country;
           this.stateName.value = result.data.result.stateName;          
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
                <strong>State</strong>
                <small> Edit</small>
                <Link to="/state" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
              
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label >Country Name</Label>                      
					  <CountrySelectBox onSelectCountry={this.handleCountry} reference={(country)=> this.country = country} value={this.state.editState.country}/>
                      {/* <FormFeedback invalid={this.state.validation.advertisementName.valid === false}>{this.state.validation.advertisementName.message}</FormFeedback> */}

                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">State Name</Label>
                      <Input type="text" innerRef={input => (this.stateName = input)} placeholder="State Name" />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">Status</Label>
                       <Input type="select" innerRef={input => (this.status = input)} id="status" className="form-control" >
						<option value="0" >Active</option>
						<option value="1" selected={(this.status.value =="0")?'selected':' '}>Inactive</option>					
					  </Input>
                    </FormGroup>
                    </Col>
                </Row>
               
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
          </Col>
        </Row>
        </div>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default StateEdit;
