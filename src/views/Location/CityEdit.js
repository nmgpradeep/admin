import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import CountrySelectBox from '../SelectBox/CountrySelectBox/CountrySelectBox'
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
// import PropTypes from 'prop-types';
class CityEdit extends Component {
  constructor(props){
    super(props);
    this.countrySelect = React.createRef();
    this.stateSelect = React.createRef();
    this.cityName = React.createRef();
    let cityId = this.props.match.params.id;
    this.state = {
      editCity: {},
      countries : '',
      states: '',
      cityId: cityId,
      validation:{
        countrySelect:{
          rules: {
            notEmpty: {
              message: 'Country name can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        stateSelect:{
          rules: {
            notEmpty: {
              message: 'State name can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        cityName:{
            rules: {
              notEmpty: {
                message: 'City name can\'t be left blank',
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
        axios.get('/location/getState/' +country ).then(result => {
          console.log('countryId',result)
          if(result.data.code == '200'){  
            this.setState({states: result.data.result, country: country});
          }
        })
  }
  
  handleState(state){
	  this.setState({state: state});
  }
  
  
//~ handleCountrys = (countries) => {
  //~ this.countrySelect.current = countries;
  //~ console.log(countries);
//~ }

//~ handleStates = (states) => {
//~ this.stateSelect.current = states;
//~ console.log(states);

//~ }

  cancelHandler(){
    this.props.history.push("/city");
  }
  submitHandler(e){
      e.preventDefault();
      console.log('in submit', this);
      let formSubmitFlag = true;
      for (let field in this.state.validation) {
        let lastValidFieldFlag = true;
        let addCity = this.state.validation;
        addCity[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  addCity[field].valid = false;
                  addCity[field].message = addCity[field].rules[fieldCheck].message;
               }
              break;
          }
        }
        this.setState({ validation: addCity});
      }

      if(formSubmitFlag){
        let editCity = this.state.editCity;
        editCity.countrySelect = this.countrySelect.value;
        editCity.stateSelect = this.stateSelect.value;
        editCity.cityName = this.cityName.value;

        console.log("editCity",editCity)
        axios.put('/location/updateCity', editCity).then(result => {
          if(result.data.code ===200){
            this.props.history.push("/city");
          }
        });
      }
  }

  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      console.log("cityId",this.state.cityId)        
      axios.get('/location/viewCity/' + this.state.cityId).then(result => {
       // console.log(result); 
         if(result.data.code === 200){     
           this.setState({ editCity: result.data.result});
           this.countrySelect.value = result.data.result.countrySelect;
           this.stateSelect.value = result.data.result.stateSelect;
           this.cityName.value = result.data.result.cityName;
        }
      })
      .catch((error) => {
        if(error.status === 401) {
          this.props.history.push("/login");
        }
      });
      console.log("statescitycon", this.state.editCity)
     // get all state  
   axios.get('/location/getState/' + this.state.editCity.countrySelect).then(result => {
	  console.log('countryId',result)
	  if(result.data.code == '200'){  
		this.setState({states: result.data.result});
	  }
	})
		
		
		console.log("states", this.state.states)
  }
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>City</strong>
                <small> Edit</small>
                <Link to="/city" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
              
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                        <Label >Country Name</Label>
                        <CountrySelectBox onSelectCountry={this.handleCountry} countryID={this.state.country} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label >State Name</Label>
                        <StateSelectBox onSelectState={this.handleState} options={this.state.states}/>
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">City Name</Label>
                      <Input type="text" innerRef={input => (this.cityName = input)} placeholder="City Name" />
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
export default CityEdit;
