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
  handleCategory = (category) => {
    this.setState({category: category})
  }
  cancelHandler(){
    this.props.history.push('/size')
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
      addSize.category = this.state.category;
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

export default SizeAdd;
