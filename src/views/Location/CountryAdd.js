import React,{ Component }from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios'
import UserSelectBox from '../SelectBox/UserSelectBox/UserSelectBox'
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
class CountryAdd extends Component {

  constructor(props){
    super(props)
    this.countryName = React.createRef(),
    this.countryCode = React.createRef(),
        
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
                      {/* <FormFeedback invalid={this.state.validation.countryCode.valid === false}>{this.state.validation.countryCode.message}</FormFeedback> */}
                      
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

export default CountryAdd;
