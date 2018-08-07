import React,{ Component }from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios';
import { 
  Button, 
  Card,
  CardBody, 
  CardHeader,
  Col,
  Form,
  FormGroup, 
  Input, 
  Label,
  Row,
} from 'reactstrap';
class CountryAdd extends Component {

  constructor(props){
    super(props)
    this.countryName = React.createRef(),
    this.countryCode = React.createRef(),
    this.status = React.createRef(),
        
    this.state = {
      addCountry: {},
      user : '',
      validation:{
        cointryName: {
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
    } 
  }

//   handleUser = (user) => {
//         this.setState({user: user});
//   }


cancelHandler(){
  this.props.history.push("/country");
 }
    
  submitHandler(e){
    e.preventDefault()
    let formSubmitFlag = true;
    for (let field in this.state.validation) {
      let lastValidFieldFlag = true;
      let addCountry = this.state.validation;
      addCountry[field].valid = null;
      // for(let fieldCheck in this.state.validation[field].rules){
      //   ~ switch(fieldCheck){
      //     ~ case 'notEmpty':
      //       ~ if(lastValidFieldFlag === true && this[field].value.length === 0){
      //           ~ lastValidFieldFlag = false;
      //           ~ formSubmitFlag = false;
      //           ~ addTestimonial[field].valid = false;
      //           ~ addTestimonial[field].message = addTestimonial[field].rules[fieldCheck].message;

      //        ~ }
      //       ~ break;
          
      //   ~ }
      // }
      this.setState({ validation: addCountry});
    }
    if(formSubmitFlag){
	console.log("USER-AUTHER",this.state.user)
      let addCountry = this.state.addCountry;
      addCountry.countryName = this.countryName.value;
      addCountry.countryCode = this.countryCode.value;
      addCountry.status = this.status.value;
      console.log("addCountry",addCountry)
      axios.post('/location/newCountry', addCountry  ).then(result => {
        if(result.data.code == '200'){
          this.props.history.push('./Country');
        }
      })
    }
  }


  render(){
    return (
      <div>
        <Card>
              <CardHeader>
                <strong>New Country Form</strong>
                <Link to="/country" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="title">Country Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text"  innerRef={input => (this.countryName= input)} />
                      {/* <FormFeedback invalid={this.state.validation.countryName.valid === false}>{this.state.validation.countryName.message}</FormFeedback> */}
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="description">Country Code</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" innerRef={input => (this.countryCode = input)} />
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
        
      </div>
    )
  }

}

export default CountryAdd;
