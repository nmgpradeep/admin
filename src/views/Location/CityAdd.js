import React,{ Component }from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios'
import StateSelectBox from '../SelectBox/StateSelectBox/StateSelectBox'
import CitySelectBox from '../SelectBox/CitySelectBox/CitySelectBox'
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
class CityAdd extends Component {

  constructor(props){
    super(props)
    this.countrySelect = React.createRef(),
    this.stateSelect = React.createRef(),
    this.cityName = React.createRef(),
    
    this.state = {
      addCity: {},
      countrys : '',
      states : '',
      validation:{
        countrySelect: {
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
        cityName: {
            rules: {
                notEmpty: {
                    message: 'City name can\'t be left blank',
                    valid: false
                }
            },
            valid: null,
            message: ''
        }
      }
    } 
  }

  handleCountry = (countrys) => {
        this.setState({countrys: countrys});
        
        axios.get('/location/getState/' +countrys ).then(result => {
          console.log('countryId',result)
          if(result.data.code == '200'){           
            this.state.countrySate = result.data.result;
            console.log("countrySate",this.state.countrySate)
           // this.props.history.push('./City');
          }
        })
  }
  handleState = (states) => {
      this.setState({states:states});
  }
    
  submitHandler(e){
    e.preventDefault()
    let formSubmitFlag = true;
    for (let field in this.state.validation) {
      let lastValidFieldFlag = true;
      let addCity = this.state.validation;
      addCity[field].valid = null;
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
      this.setState({ validation: addCity});
    }
    if(formSubmitFlag){
    console.log("COUNTRYS",this.state.countrys)
    console.log("STATES",this.state.states)
      let addCity = this.state.addCity;
      addCity.countrySelect = this.state.countrys;
      addCity.stateSelect = this.state.states;
      addCity.cityName = this.cityName.value;
      console.log("addCity",addCity)
      axios.post('/location/newCity', addCity  ).then(result => {
        if(result.data.code == '200'){
          this.props.history.push('./City');
        }
      })
    }
  }


  render(){
    return (
      <div>
        <Card>
              <CardHeader>
                <strong>New City Form</strong>
                <Link to="/city" className="btn btn-success btn-sm pull-right">Back</Link>
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
                      <Label htmlFor="author">State Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <CitySelectBox onSelectState={this.handleState} value={this.state.countrySate}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="description">City Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.cityName.valid === false} innerRef={input => (this.cityName = input)} />
                      <FormFeedback invalid={this.state.validation.cityName.valid === false}>{this.state.validation.cityName.message}</FormFeedback>
                      
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

export default CityAdd;
