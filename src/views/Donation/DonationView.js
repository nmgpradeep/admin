import React, { Component } from 'react';
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
      donationId: this.props.match.params.id
    };
  }
  cancelHandler(){
    this.props.history.push("/donations");
  }
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/donation/viewDonation/' + this.state.donationId).then(result => {
        if(result.data.code == '200'){
          //localStorage.setItem('jwtToken', result.data.result.accessToken);
          this.setState({ viewDonation: result.data.result});
          this.productName.value = result.data.result.productName;
          this.description.value = result.data.result.description;
          this.productCategory.value = result.data.result.productCategory;
          this.userId.value = result.data.result.userId;
          this.size.value = result.data.result.size;
          this.color.value = result.data.result.color;
          this.brand.value = result.data.result.brand;
          this.productAge.value = result.data.result.productAge;
          //this.status.value = result.data.result.status;
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
                      <Input type="text" value={this.state.viewDonation.productName} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="description">Description</Label>
                      <Input type="text" value={this.state.viewDonation.description} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="Product Category">Product Category</Label>
                      <Input type="text" value={this.state.viewDonation.productCategory} />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="UserId">User Id</Label>
                  <Input type="text" value={this.state.viewDonation.userId} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="size">Size</Label>
                  <Input type="text" value={this.state.viewDonation.size} required/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="color">Color</Label>
                  <Input type="text" value={this.state.viewDonation.color} required/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="brand">Brand</Label>
                  <Input type="text" value={this.state.viewDonation.brand} required/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="productAge">Age</Label>
                  <Input type="text" value={this.state.viewDonation.productAge} required/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="status">Status</Label>
                  <Input type="text" value={(this.state.viewDonation.status === '1')?'Active':'Inactive'} />
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
export default DonationView;
