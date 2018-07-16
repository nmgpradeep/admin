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
class SizeAdd extends Component {

  constructor(props){
    super(props)
    this.size = React.createRef(),
    this.category = React.createRef(),
    
    this.state = {
      addSize: {},
      validation:{
        size: {
          rules: {
            notEmpty: {
              message: 'Size can\'t be left blank',
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
      let addSize = this.state.validation;
      addSize[field].valid = null;
      for(let fieldCheck in this.state.validation[field].rules){
        switch(fieldCheck){
          case 'notEmpty':
            if(lastValidFieldFlag === true && this[field].value.length === 0){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addSize[field].valid = false;
                addSize[field].message = addSize[field].rules[fieldCheck].message;

             }
            break;
          
        }
      }
      this.setState({ validation: addSize});
    }
    if(formSubmitFlag){
      let addSize = this.state.addSize;
      addSize.size = this.size.value;
      addSize.category = this.category.value;
      axios.post('/size/newSize', addSize  ).then(result => {
        console.log('testing', result)
        if(result.data.code === 200){
          console.log('testing')
          this.props.history.push('./Size');
        }
      })
    }
  }


  render(){
    return (
      <div>
        <Card>
              <CardHeader>
                <strong>New Size Form</strong>
                <Link to="/size" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  
                  <FormGroup row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Sizes</Label>
                      <Input type="number " invalid={this.state.validation.size.valid === false} innerRef={input => (this.size = input)} placeholder="Size" />

                      <FormFeedback invalid={this.state.validation.size.valid === false}>{this.state.validation.size.message}</FormFeedback>

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

export default SizeAdd;
