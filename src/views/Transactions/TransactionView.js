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
        if(result.data.code == '200'){         
          this.setState({ viewTransaction: result.data.result});
          console.log('dddddddddd',result.data.result);
          this.paymentId.value = result.data.result.paymentId;
          this.status.value = result.data.result.status;
          this.transactionAmount.value = result.data.result.transactionAmount;
          this.transactionDate.value = result.data.result.transactionDate;
          this.transactionId.value = result.data.result.transactionId;
          this.transactionType.value = result.data.result.transactionType;
          this.updatedAt.value = result.data.result.updatedAt;
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
                  <Label htmlFor="id">Payment ID</Label>
                  <Input type="text" value={this.state.viewTransaction.paymentId} />
                </FormGroup>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Transaction Amount</Label>
                      <Input type="text" value={this.state.viewTransaction.transactionAmount} />
                    </FormGroup>
                    </Col>                    
                </Row>
                <FormGroup>
                  <Label htmlFor="username">TransactionDate</Label>
                  <Input type="text" value={this.state.viewTransaction.transactionDate} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Transaction Id</Label>
                  <Input type="text"  value={this.state.viewTransaction.transactionId} required/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Transaction Type</Label>
                  <Input type="text"  value={this.state.viewTransaction.transactionType} required/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Updated At</Label>
                  <Input type="text"  value={this.state.viewTransaction.updatedAt} required/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="status">Status</Label>
                  <Input type="text" value={(this.state.viewTransaction.status === '1')?'Active':'Inactive'} />
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
