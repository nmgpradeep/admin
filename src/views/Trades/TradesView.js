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
class TradesView extends Component {
  constructor(props){
    super(props);
    this.state = {
      viewTrade: [],
      tradeId: this.props.match.params.id
    };
  }
  cancelHandler(){
    this.props.history.push("/trades");
  }
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/trade/viewTrade/' + this.state.tradeId).then(result => {
        if(result.data.code == '200'){
          //localStorage.setItem('jwtToken', result.data.result.accessToken);
          this.setState({ viewTrade: result.data.result});
          this.sellerId.value = result.data.result.sellerId.firstName;
          this.receiverId.value = result.data.result.receiverId.firstName;
          this.sellerProductId.value = result.data.result.sellerProductId.productName;
          this.receiverProductId.value = result.data.result.receiverProductId.productName;
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
                <strong>Trade</strong>
                <small> View</small>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="id">ID</Label>
                  <Input type="text" value={this.state.viewTrade._id} />
                </FormGroup>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Seller name</Label>
                      <Input type="text" value={this.state.viewTrade.sellerId} />
                    </FormGroup>
                    </Col>
                    
                </Row>
                <FormGroup>
                  <Label htmlFor="username">Receiver Name</Label>
                  <Input type="text" value={this.state.viewTrade.receiverId} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Selled Product</Label>
                  <Input type="text"  value={this.state.viewTrade.sellerProductId} required/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="username">Received Product</Label>
                  <Input type="text" value={this.state.viewTrade.receiverProductId} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="status">Status</Label>
                  <Input type="text" value={(this.state.viewTrade.status === '1')?'Active':'Inactive'} />
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
export default TradesView;
