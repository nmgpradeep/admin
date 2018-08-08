import React, { Component } from 'react';
import ReadMoreReact from 'read-more-react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import axios from 'axios';
import ReactStars from 'react-stars'

// import PropTypes from 'prop-types';
class TestimonialView extends Component {
  constructor(props){
    super(props);
    this.state = {
      viewTestimonial: [],
      testimonialId: this.props.match.params.id
    };
  }
  cancelHandler(){
    this.props.history.push("/Testimonial");
  }
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/testimonial/viewTestimonial/' + this.state.testimonialId).then(result => {
        if(result.data.code == '200'){
          this.setState({ viewTestimonial: result.data.result});
          this.title.value = result.data.result.title;
          this.description.value = result.data.result.description;
          this.review.value = result.data.result.review;
          this.author.value = result.data.result.author;
          
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
                <small> View</small>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="id">ID</Label>
                  <Input type="text" value={this.state.viewTestimonial._id} />
                </FormGroup>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Testimonial Title</Label>
                      <Input type="text" value={this.state.viewTestimonial.title} />
                    </FormGroup>
                    </Col>
                    {/* <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">Middle name</Label>
                      <Input type="text" value={this.state.viewUser.middleName} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="lastname">Last name</Label>
                      <Input type="text" value={this.state.viewUser.lastName} />
                    </FormGroup>
                  </Col> */}
                </Row>
                <FormGroup>
                  <Label htmlFor="description">Description</Label>                
                  <Input type="textarea" value={this.state.viewTestimonial.description} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="auther">Author</Label>
                  <Input type="text"  value={(this.state.viewTestimonial.author)?this.state.viewTestimonial.author.userName:''} required/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="review">Review</Label>
                   <ReactStars  count={5} size={24} color2={'#ffd700'} edit={false} value={this.state.viewTestimonial.review}  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="status">Status</Label>
                  <Input type="text" value={(this.state.viewTestimonial.status === '1')?'Active':'Inactive'} />
                </FormGroup>
                <Row>
                  <Col xs="6" className="text-right">
                    <Button onClick={()=>this.cancelHandler()} color="primary" className="px-4">Cancel</Button>
                  </Col>
                  <Col xs="6">

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
export default TestimonialView;
