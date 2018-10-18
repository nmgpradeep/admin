import React,{ Component }from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios'
import UserSelectBox from '../SelectBox/UserSelectBox/UserSelectBox'
import ReactStars from 'react-stars'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormFeedback,
  Input,
  Label,
  Row,
} from 'reactstrap';
class TestimonialAdd extends Component {

  constructor(props){
    super(props)
    this.title = React.createRef(),
    this.description = React.createRef(),
    this.author = React.createRef(),
    this.review = React.createRef(),
    
    this.state = {
      addTestimonial: {},
      user : '',
      validation:{
        title: {
          rules: {
            notEmpty: {
              message: 'Testimonial title can\'t be left blank',
              valid: false

            }
          },
          valid: null,
          message: ''
        },
        description:{
          rules: {
            notEmpty: {
              message: 'Testimonial description can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        author: {
          rules: {
            notEmpty: {
              message: 'redirectURL can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
      }
    } 
  }

  ratingChanged = (rating) => {
     console.log(rating)
       this.setState({rating: rating});
  }

  cancelHandler(){
    this.props.history.push("/testimonial");
   }
  
  
  
  
  handleUser = (user) => {
        this.setState({user: user});
  }
    
  submitHandler(e){
    e.preventDefault()
    let formSubmitFlag = true;
    for (let field in this.state.validation) {
      //let lastValidFieldFlag = true;
      let addTestimonial = this.state.validation;
      addTestimonial[field].valid = null;
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
      this.setState({ validation: addTestimonial});
    }
    if(formSubmitFlag){
	  console.log("USER-AUTHER",this.state.user)
      let addTestimonial = this.state.addTestimonial;
      addTestimonial.title = this.title.value;
      addTestimonial.description = this.description.value;
      addTestimonial.author = this.state.user;
      addTestimonial.review = this.state.rating;
      console.log("addTestimonial",addTestimonial)
      axios.post('/testimonial/newTestimonial', addTestimonial  ).then(result => {
        if(result.data.code == '200'){
          this.props.history.push('./Testimonial');
        }
      })
    }
  }


  render(){
    return (
      <div>
        <Card>
              <CardHeader>
                <strong>New Testimonial Form</strong>
                <Link to="/testimonial" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="title">Title</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.title.valid === false}  innerRef={input => (this.title = input)} placeholder="Title" required/>
                      <FormFeedback invalid={this.state.validation.title.valid === false}>{this.state.validation.title.message}</FormFeedback>                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="description">Description</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="textarea" invalid={this.state.validation.description.valid === false} innerRef={input => (this.description = input)} placeholder="Description" required/>
                      <FormFeedback invalid={this.state.validation.description.valid === false}>{this.state.validation.description.message}</FormFeedback>
                      
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
                      <Label htmlFor="author">Author</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <UserSelectBox onSelectUser={this.handleUser}/>
                    </Col>
                  </FormGroup>
                   <FormGroup row>
                   <Col md="3">
                      <Label htmlFor="author">Reviews</Label>
                    </Col>
                    <Col xs="12" md="9">
					  <ReactStars  count={5} onChange={this.ratingChanged} size={24} color2={'#ffd700'}  innerRef={input => (this.review = input)} value={this.state.rating}/>
					</Col>
                  </FormGroup>  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="Status">Status</Label>
                    </Col>
                    <Col xs="12" md="9">
                     <Input type="select" innerRef={input => (this.status = input)} id="status" className="form-control">
						 <option value="1">Active</option>
						<option value="0">Inactive</option>
					 </Input>                   
                    </Col>
                  </FormGroup> 
              <Row>
                  <Col xs="6" className="text-right">
                    <Button onClick={(e)=>this.submitHandler(e)} color="success" className="px-4">Submit</Button>
                  </Col>
                  <Col xs="6">
                    <Button onClick={()=>this.cancelHandler()} color="primary" className="px-4">Cancel</Button>
                  </Col>
                </Row>
                </Form>
              </CardBody>
              
            </Card>
        
      </div>
    )
  }

}

export default TestimonialAdd;
