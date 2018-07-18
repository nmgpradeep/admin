import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import Transaction from './Transaction';

class Transactions extends Component {
  constructor(props){
    super(props);
    this.state = {
      transactions: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      transactionsCount: 0
    };
    console.log('THIS OBJ', this);
    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
    this.toggle = this.toggle.bind(this);
   // this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/transaction/transactions/:page').then(result => {
        if(result.data.code == 200){
          this.setState({
            transactions: result.data.result,
            currentPage: result.data.current,
            PerPage: result.data.perPage,
            totalPages: result.data.pages,
            transactionsCount:result.data.total
          });
        }
        console.log(this.state.transactions);
      })
      .catch((error) => {
		  console.log('error', error)
        if(error.code === 401) {
          this.props.history.push("/login");
        }
      });
  }
  
   transactionDeleteHandler (id){
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }
 
  changeStatusHandler(transaction){
	  
    transaction.status = (1 - parseInt(transaction.status)).toString();
    
    //console.log('aaaaaaaaaaaaaaaaaaa',transaction);
    axios.post('/transaction/changeStatus', transaction).then(result => {
      if(result.data.code === 200){
        let transactions = this.state.transactions;
        let transactionIndex = transactions.findIndex(x => x._id === transaction._id);
        transactions[transactionIndex].status = transaction.status.toString();
        this.setState({ transactions: transactions});
      }
    });
  }
 
 
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  
  
  render() {
   let transactions;
     if(this.state.transactions){
       let listTransaction = this.state.transactions;
       transactions = listTransaction.map((transaction,index) => <Transaction sequenceNo={index} key={transaction._id}  changeStatus={(transaction) => this.changeStatusHandler(transaction)} transaction={transaction}/>);
       
     }
     let paginationItems =[];
     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Transaction Listing
              
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
					  <tr>
              <th>S.No</th>
						<th>TransactionType</th>
						<th>UserId</th>
						<th>PaymentId</th>
						<th>TransactionDate</th>
						<th>TransactionAmount</th>
						<th>Status</th>
						<th>Action</th>
					  </tr>
                  </thead>
                  <tbody>
                  {transactions}
                  </tbody>
                </Table>
                <nav>
                  <Pagination>
                    <PaginationItem>
                      <PaginationLink previous tag="button">Prev</PaginationLink>
                    </PaginationItem>
                     {paginationItems}

                    <PaginationItem active>
                      <PaginationLink tag="button">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                  </Pagination>
                </nav>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} external={externalCloseBtn}>
          <ModalHeader>Modal title</ModalHeader>
          <ModalBody>
            Are you sure to delete?
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.approveDeleteHandler}>Yes</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>No</Button>
          </ModalFooter>
        </Modal>
      </div>

    );
  }
}

export default Transactions;
