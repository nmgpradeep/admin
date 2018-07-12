import React,{ Component }from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios'
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
class BrandAdd extends Component {

  constructor(props){
    super(props)
    this.brandName = React.createRef(),
    this.category = React.createRef(),
    
    this.state = {
      addBrand: {},
      validation:{
        brandName: {
          rules: {
            notEmpty: {
              message: 'Brand name can\'t be left blank',
              valid: false

            }
          },
          valid: null,
          message: ''
        },  
      }
    } 
  }

  submitHandler(e){
    e.preventDefault()
    let formSubmitFlag = true;
    for (let field in this.state.validation) {
      let lastValidFieldFlag = true;
      let addBrand = this.state.validation;
      addBrand[field].valid = null;
      for(let fieldCheck in this.state.validation[field].rules){
        switch(fieldCheck){
          case 'notEmpty':
            if(lastValidFieldFlag === true && this[field].value.length === 0){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addBrand[field].valid = false;
                addBrand[field].message = addBrand[field].rules[fieldCheck].message;

             }
            break;
          
        }
      }
      this.setState({ validation: addBrand});
    }
    if(formSubmitFlag){
      let addBrand = this.state.addBrand;
      addBrand.brandName = this.brandName.value;
      addBrand.category = this.category.value;
      axios.post('/brand/newBrand', addBrand  ).then(result => {
        console.log('testing', result)
        if(result.data.code === 200){
          console.log('testing')
          this.props.history.push('./Brand');
        }
      })
    }
  }


  render(){
    return (
      <div>
        <Card>
              <CardHeader>
                <strong>New Brand Form</strong>
                <Link to="/brand" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  
                  <FormGroup row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Brand Name</Label>
                      <Input type="text" invalid={this.state.validation.brandName.valid === false} innerRef={input => (this.brandName = input)} placeholder="Brand Name" />

                      <FormFeedback invalid={this.state.validation.brandName.valid === false}>{this.state.validation.brandName.message}</FormFeedback>

                    </FormGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup>
                  <Label htmlFor="category">Category</Label>
                   <select innerRef={input => (this.category = input)} id="select" class="form-control" >
					  <option value="0">Please select</option>
					  <option value="1">Mobiles</option>
					  <option value="2">Television</option>
					  <option value="3">Washing Machine</option>
                  </select>

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

export default BrandAdd;
