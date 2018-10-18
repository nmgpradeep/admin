import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
// import PropTypes from 'prop-types';
class CountryEdit extends Component {
  constructor(props){
    super(props);
    this.countryName = React.createRef();
    this.countryCode = React.createRef();
    this.status = React.createRef();        
    let countryId = this.props.match.params.id;
    this.state = {
      editCountry: {},
      countryId: countryId,
      validation:{
        countryName:{
          rules: {
            notEmpty: {
              message: 'Country name can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        countryCode:{
          rules: {
            notEmpty: {
              message: 'Country code can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
      }
    };
  }
  
//   handleUser = (user) => {
// 	  this.author.current = user;
// 	  console.log(user);	  
//         //this.setState({user: user});
//   }
    
  cancelHandler(){
    this.props.history.push("/country");
  }
  submitHandler(e){
      e.preventDefault();
      console.log('in submit', this);
      let formSubmitFlag = true;
      for (let field in this.state.validation) {
        let lastValidFieldFlag = true;
        let addCountry = this.state.validation;
        addCountry[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  addCountry[field].valid = false;
                  addCountry[field].message = addCountry[field].rules[fieldCheck].message;

               }
				break;
		   default:
				break
          }
        }
        this.setState({ validation: addCountry});
      }

      if(formSubmitFlag){
        let editCountry = this.state.editCountry;
        editCountry.countryName = this.countryName.value;
        editCountry.countryCode = this.countryCode.value;
        editCountry.status = this.status.value;
        console.log("editCountry",editCountry)
        axios.put('/location/updateCountry', editCountry).then(result => {
          if(result.data.code === 200){
            this.props.history.push("/country");
          }
        });
      }
  }

  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/location/viewCountry/' + this.state.countryId).then(result => {
       // console.log(result); 
         if(result.data.code === 200){
        //   //localStorage.setItem('jwtToken', result.data.result.accessToken);
           this.setState({ editCountry: result.data.result});
          
           this.countryName.value = result.data.result.countryName;
           this.countryCode.value = result.data.result.countryCode;
           this.status.value = result.data.result.status;
           console.log('HERE in component Did mount', this);
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
                <strong>Country</strong>
                <small> Edit</small>
                <Link to="/country" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
              
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label >Country Name</Label>
                      <Input type="text" innerRef={input => (this.countryName = input)}   placeholder="COuntry Name" />

                      {/* <FormFeedback invalid={this.state.validation.advertisementName.valid === false}>{this.state.validation.advertisementName.message}</FormFeedback> */}

                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">Country Code</Label>
                      <Input type="text" innerRef={input => (this.countryCode = input)} placeholder="Country Code" />
                    </FormGroup>
                    </Col>
                   <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="Status">Status</Label>
                      <Input type="select" innerRef={input => (this.status = input)} id="status" className="form-control" >
						<option value="0" >Active</option>
						<option value="1" selected={(this.status.value =="0")?'selected':' '}>Inactive</option>					
					</Input>
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
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
export default CountryEdit;
