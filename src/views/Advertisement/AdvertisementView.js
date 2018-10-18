import React, { Component } from 'react';
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
import axios from 'axios';
// import PropTypes from 'prop-types';
class AdvertisementView extends Component {
  constructor(props){
    super(props);
    this.state = {
      viewAdv: [],
      advId: this.props.match.params.id
    };
  }
  cancelHandler(){
    this.props.history.push("/advertisement");
  }
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
    //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/advertisement/viewAds/' + this.state.advId).then(result => {
        if(result.data.code == '200'){
          //localStorage.setItem('jwtToken', result.data.result.accessToken);
          this.setState({ viewAdv: result.data.result});
          this.advertisementName.value = result.data.result.advertisementName;
          this.description.value = result.data.result.description;
          this.redirectURL.value = result.data.result.redirectURL;
          //this.image.value = result.data.result.image;
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
                <strong>Advertisement</strong>
                <small> View</small>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="id">ID</Label>
                  <Input type="text" value={this.state.viewAdv._id} />
                </FormGroup>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Advertisement name</Label>
                      <Input type="text" value={this.state.viewAdv.advertisementName} />
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
                  <Label htmlFor="username">Description</Label>
                  <Input type="text" value={this.state.viewAdv.description} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">URL</Label>
                  <Input type="url"  pattern="(http|https)://.+" value={this.state.viewAdv.redirectURL} required/>
                </FormGroup>
                <FormGroup>
                <Col xs="12" className="text-left">
                  <Label htmlFor="status">Image</Label>
                   </Col>
                  <Col xs="12" sm="12">
                  <img className="linkedin" src= {'assets/uploads/AdvertisementImage/'+this.state.viewAdv.image} width="60"/>
                  </Col>
                  
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="status">Status</Label>
                  <Input type="text" value={(this.state.viewAdv.status === '1')?'Active':'Inactive'} />
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
export default AdvertisementView;
