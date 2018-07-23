import React, { Component } from 'react';
import {Link} from 'react-router-dom';
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

// import PropTypes from 'prop-types';
class DonationView extends Component {
  constructor(props){
    super(props);
    this.state = {
      viewDonation: [],
      condition :[],
      donationId: this.props.match.params.id
    };
  }
  cancelHandler(){
    this.props.history.push("/donations");
  }
  
 

  
   
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
       axios.get('/donation/getConstant').then(result => {
           this.setState({conditions: result.data.result});            
       });
      axios.get('/donation/viewDonation/' + this.state.donationId).then(result => {
        if(result.data.code == '200'){
          //localStorage.setItem('jwtToken', result.data.result.accessToken);          
          this.setState({ viewDonation: result.data.result});
          console.log("viewDonation",result.data.result);
          this.productName.value = result.data.result.productName;
          this.description.value = result.data.result.description;
          this.productCategory.value = result.data.result.productCategory.categoryName;
          this.userId.value = result.data.result.userId.firstName;
          this.size.value = result.data.result.size;
          this.condition.value = result.data.result.condition;
          this.color.value = result.data.result.color;
          this.brand.value = result.data.result.brand;
          this.productAge.value = result.data.result.productAge;
          this.productImage.value = result.data.result.productImage;
          //console.log('ddddddddddddddddd',this.state.viewDonation);
          //~ //this.status.value = result.data.result.status;
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
                <strong>Donation</strong>
                <small> View</small>
                 <Link to={'/donations/edit/' + this.state.viewDonation._id} className="btn btn-success btn-sm pull-right">Edit Product</Link>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="id">ID</Label>
                  <Input type="text" value={this.state.viewDonation._id} />
                </FormGroup>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Product name</Label>
                      <Input type="text" innerRef={input => (this.productName= input)} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="description">Description</Label>
                      <Input type="text" innerRef={input => (this.description= input)} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="Product Category">Product Category</Label>
                      <Input type="text" innerRef={input => (this.productCategory= input)} />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="UserId">User Id</Label>
                  <Input type="text" innerRef={input => (this.userId= input)} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="size">Size</Label>
                  <Input type="text"  innerRef={input => (this.size= input)} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="color">Color</Label>
                  <Input type="text" innerRef={input => (this.color= input)} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="brand">Brand</Label>
                  <Input type="text" innerRef={input => (this.brand= input)} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="productAge">Age</Label>
                  <Input type="text" innerRef={input => (this.productAge= input)}  required/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="productAge">Condition</Label>
                  <Input type="text" innerRef={input => (this.condition= input)}  required/>
                </FormGroup>
                <FormGroup>
                <Col xs="12" className="text-left">
                  <Label htmlFor="status">Image</Label>
                   </Col>
                  <Col xs="12" sm="12">
                  <img className="linkedin" src={'assets/uploads/donationImage/'+this.state.viewDonation.productImage} width="60"/>
                  </Col>                  
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="status">Status</Label>
                  <Input type="text" value={(this.state.viewDonation.productStatus === '1')?'Active':'Inactive'} />
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
//};
export default DonationView;
