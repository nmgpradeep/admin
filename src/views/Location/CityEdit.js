import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import CountrySelectBox from '../SelectBox/CountrySelectBox/CountrySelectBox'
import StateSelectBox from '../SelectBox/StateSelectBox/StateSelectBox'
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
// import PropTypes from 'prop-types';

class CityEdit extends Component {
  constructor(props){
    super(props);
    this.countrySelect = React.createRef();
    this.stateSelect = React.createRef();
    this.cityName = React.createRef();
    this.status = React.createRef();
    let cityId = this.props.match.params.id;
    this.state = {
      cityId: cityId,
      cityForm: {
        countrySelect: {
          elementType: "select-simple",
          elementConfig: {
            options: []
          },
          value: "",
          label: "Country",
          title: "countryName",
          validation: {
            required: false
          },
          valid: true,
          touched: false
        },
        stateSelect: {
          elementType: "select-simple",
          elementConfig: {
            options: []
          },
          value: "",
          label: "State",
          title: "stateName",
          validation: {
            required: false
          },
          valid: true,
          touched: false
        },
        cityName: {
          elementType: "input",
          elementConfig: {
            type: "text",
            placeholder: "City Name"
          },
          value: "",
          label: "City Name",
          title: "cityName",
          validation: {
            required: true
          },
          valid: false,
          touched: false
        }
      }
    };
   }
  
  handleCountry = (country) => { 	  
	axios.get('/location/getState/' +country ).then(result => {
	  console.log('countryId',result)
	  if(result.data.code === 200){  
		const updatedCityForm = {
		  ...this.state.cityForm
		};
		updatedCityForm.stateSelect.elementConfig.options = result.data.result;
		this.setState({cityForm: updatedCityForm});
	  }
	})
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
    const updatedCityForm = {
      ...this.state.cityForm
    };
    const updatedCityFormElement = {
      ...updatedCityForm[inputIdentifier]
    };
    updatedCityFormElement.value = event.target.value;
    updatedCityFormElement.valid = this.checkValidity(
      updatedCityFormElement.value,
      updatedCityFormElement.validation
    );
    if(inputIdentifier === 'countrySelect'){
		this.handleCountry(updatedCityFormElement.value);
	}
    
    updatedCityFormElement.touched = true;
    updatedCityForm[inputIdentifier] = updatedCityFormElement;
    this.setState({ cityForm: updatedCityForm });
  };
  
  cancelHandler(){
    this.props.history.push("/city");
  }
  submitHandler(e) {
    e.preventDefault();
    let editCity = {_id: this.state.cityId};
    for (let key in this.state.cityForm) {
      editCity[key] = this.state.cityForm[key].value;
    }
    axios.put('/location/updateCity', editCity).then(result => {
      if (result.data.code == "200") {
        this.props.history.push("/city");
      }
    });
  }
  

  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
	  axios.get('/location/listCountry').then(result => {
      if(result.data.code === 200){
        const updatedCityForm = {
		  ...this.state.cityForm
		};
		updatedCityForm.countrySelect.elementConfig.options = result.data.result;
		this.setState({cityForm: updatedCityForm});		
      }      
    })
    .catch((error) => {
    console.log('error', error)
      if(error.code === 401) {
        this.props.history.push("/login");
      }
    });
      axios.get('/location/viewCity/' + this.state.cityId).then(result => {
        console.log('in componentDidMount city details', result); 
         if(result.data.code === 200){ 
		   let cityForm = this.state.cityForm;
          for (let key in cityForm) {
			  cityForm[key].value = result.data.result[key];
		  }
		  this.setState({cityForm: cityForm});
		  this.handleCountry(cityForm.countrySelect.value);
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
    for (let key in this.state.cityForm) {
      formElementsArray.push({
        id: key,
        config: this.state.cityForm[key]
      });
    }
    console.log('FRMEM', formElementsArray);
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
                title={formElement.config.title}
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
                <strong>Edit City</strong>
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
export default CityEdit;
