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
class SubscriptionView extends Component {
  constructor(props){
    super(props);
    this.state = {
      viewSubscription: [],
      subscriptionId: this.props.match.params.  id
    };
  }
  cancelHandler(){
    this.props.history.push("/subscriptions");
  }
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      console.log('View')
      axios.get('/subscription/viewSubscription/' + this.state.subscriptionId).then(result => {
        if(result.data.code == '200'){
          //localStorage.setItem('jwtToken', result.data.result.accessToken);
          this.setState({ viewSubscription: result.data.result});
          this.subscriptionName.value = result.data.result.subscriptionName;
          this.description.value = result.data.result.description;
          this.price.value = result.data.result.price;
          this.totalTradePermitted.value = result.data.result.totalTradePermitted;
          this.totalInventoryAllowed.value = result.data.result.totalInventoryAllowed;
          this.timePeriod.value = result.data.result.timePeriod;
        }
      })
      .catch((error) => {
        if(error.code === 401) {
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
                <strong>Subscription</strong>
                <small> View</small>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="id">ID</Label>
                  <Input type="text" value={this.state.viewSubscription._id} />
                </FormGroup>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Subscription name</Label>
                      <Input type="text" value={this.state.viewSubscription.subscriptionName} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">Description</Label>
                      <Input type="text" value={this.state.viewSubscription.description} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="lastname">Price</Label>
                      <Input type="number" value={this.state.viewSubscription.price} />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="username">Total Trade Permitted</Label>
                  <Input type="number" value={this.state.viewSubscription.totalTradePermitted} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Total Inventory Allowed</Label>
                  <Input type="number"  value={this.state.viewSubscription.totalInventoryAllowed} required/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Time Period</Label>
                  <Input type="number"  value={this.state.viewSubscription.timePeriod} required/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="status">Status</Label>
                  <Input type="text" value={(this.state.viewSubscription.status === '1')?'Active':'Inactive'} />
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
export default SubscriptionView;
