import React,{ Component }from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios'
import CategorySelectBox from '../SelectBox/CategorySelectBox/CategorySelectBox'

import {
  Button, 
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col, 
  Form,
  FormGroup,  
  FormFeedback,
  Input,  
  Label,
  Row,
} from 'reactstrap';

class BrandAdd extends Component {

  constructor(props){
    super(props)
    this.brandName = React.createRef(),
    this.brandCategory = React.createRef(),
    
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

  handleCategory = (category) => {
     this.setState({category: category});
  }
 
  cancelHandler(){
    this.props.history.push("/brand");
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
      addBrand.category = this.state.category;
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
                   <Label htmlFor="category">Category</Label><br/>
                   <CategorySelectBox onSelectCategory={this.handleCategory}/>
                </FormGroup>
                </Form>
              </CardBody>
              <CardFooter>
				<Row>
                  <Col xs="6" className="text-right">
                    <Button onClick={(e)=>this.submitHandler(e)} color="success" className="px-4">Submit</Button>
                  </Col>
                  <Col xs="6">
                    <Button onClick={()=>this.cancelHandler()} color="primary" className="px-4">Cancel</Button>
                  </Col>
                </Row>				
              </CardFooter>
            </Card>        
      </div>
    )
  }

}

export default BrandAdd;
