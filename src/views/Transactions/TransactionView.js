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

class TransactionView extends Component {
  constructor(props){
    super(props);
    this.state = {
      viewTransaction: [],
      viewTransactionId: this.props.match.params.id
    };
  }
  cancelHandler(){
    this.props.history.push("/transactions");
  }
  componentDidMount() {
      axios.get('/transaction/viewTransaction/' + this.state.viewTransactionId).then(result => {
		  console.log(result);
        if(result.data.code == '200'){         
          this.setState({ viewTransaction: result.data.result});
          console.log(result.data.result);
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
                <strong>User</strong>
                <small> Edit</small>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="id"></Label>
                  <Input type="text" value={this.state.viewTransaction._id} />
                </FormGroup>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Transaction ID</Label>
                      <Input type="text" value={this.state.viewTransaction.transactionId} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">Transaction Type</Label>
                      <Input type="text" value={this.state.viewTransaction.transactionType} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="lastname">User ID</Label>
                      <Input type="text" value={this.state.viewTransaction.userId} />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="username">Payment ID</Label>
                  <Input type="text" value={this.state.viewTransaction.paymentId} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">TransactionDate</Label>
                  <Input type="text" value={this.state.viewTransaction.transactionDate} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Transaction Amount</Label>
                  <Input type="text" value={this.state.viewTransaction.transactionAmount} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="status">Status</Label>
                  <Input type="text" value={(this.state.viewTransaction.userStatus === '1')?'Active':'Inactive'} />
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
export default TransactionView;
