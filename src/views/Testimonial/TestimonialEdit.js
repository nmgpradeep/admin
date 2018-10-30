import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import UserSelectBox from '../SelectBox/UserSelectBox/UserSelectBox'
import ReactStars from 'react-stars'
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
class TestimonialEdit extends Component {
  constructor(props){
    super(props);
    this.title = React.createRef();
    this.description = React.createRef();
    this.author = React.createRef();
    this.review = React.createRef();
    let testimonialId = this.props.match.params.id;
    this.state = {
      editTestimonial: {},
      user : '',
      testimonialId: testimonialId,
      validation:{
        title:{
          rules: {
            notEmpty: {
              message: 'Testimonial title field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        description:{
          rules: {
            notEmpty: {
              message: 'Description field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        author: {
          rules: {
            notEmpty: {
              message: 'Author field can\'t be left blank',
              valid: false
            },
          },
          valid: null,
          message: ''
        }
      }
    };
  }
  
   ratingChanged = (review) => {       
	   console.log('rrrr',review);
       this.setState({review: review});
   }
  
  handleUser = (user) => {
      this.setState({user: user});
  }
    
  cancelHandler(){
    this.props.history.push("/testimonial");
  }
  
  submitHandler(e){
      e.preventDefault();
      console.log('in submit', this);
      let formSubmitFlag = true;
      for(let field in this.state.validation) {
      //  let lastValidFieldFlag = true;
        let addTestimonial = this.state.validation;
        addTestimonial[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              //~ if(lastValidFieldFlag === true && this[field].value.length === 0){
                  //~ lastValidFieldFlag = false;
                  //~ formSubmitFlag = false;
                  //~ addTestimonial[field].valid = false;
                  //~ addTestimonial[field].message = addTestimonial[field].rules[fieldCheck].message;
               //~ }
              break;
            default:
				break
          }
        }
        this.setState({ validation: addTestimonial});
      }

      if(formSubmitFlag){
        let editTestimonial = this.state.editTestimonial;
        editTestimonial.title = this.title.value;
        editTestimonial.description = this.description.value;
        editTestimonial.author = (this.state.user)?this.state.user:this.state.editTestimonial.author._id;
        editTestimonial.review = this.state.review;
        console.log("editTestimonial",editTestimonial)
        axios.put('/testimonial/updateTestimonial', editTestimonial).then(result => {
          if(result.data.code ===200){
            this.props.history.push("/testimonial");
          }
        });
      }
  }

  componentDidMount() {
      axios.get('/testimonial/viewTestimonial/' + this.state.testimonialId).then(result => {		  
         if(result.data.code === 200){		
			//console.log('HERE in component Did mount',result.data.result.author._id);
           this.setState({ editTestimonial: result.data.result});          
           this.title.value = result.data.result.title;
           this.description.value = result.data.result.description;
           this.author.value = result.data.result.author._id;
           this.review.value = result.data.result.review;
           
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
                <strong>Testimonial</strong>
                <small> Edit</small>
                <Link to="/testimonial" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label >Testimonial Title</Label>
                      <Input type="text" innerRef={input => (this.title = input)}   placeholder="Title" />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">Description</Label>
                      <Input type="textarea" innerRef={input => (this.description = input)} placeholder="Description" />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
					   <FormGroup>
						  <Label htmlFor="author">User</Label>									  
						  <UserSelectBox onSelectUser={this.handleUser} reference={(author)=> this.author = author} value={this.state.editTestimonial.author?this.state.editTestimonial.author._id:''}/>				
						  </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                      <FormGroup>                  
                      <Label>Reviews</Label>                      
					       <ReactStars count={5} onChange={this.ratingChanged} size={27} color2={'#ffd700'}  innerRef={input => (this.review = input)} value={this.state.editTestimonial.review}/>
                      </FormGroup>
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
export default TestimonialEdit;
