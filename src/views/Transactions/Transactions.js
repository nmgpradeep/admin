import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Form,  Input, InputGroup,  InputGroupAddon,  InputGroupText, } from 'reactstrap';
import axios from 'axios';
import ReactExport from "react-data-export";
import Transaction from './Transaction';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import ReactPaginate from "react-paginate";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
var FD = require('form-data');
var fs = require('fs');


class Transactions extends Component {
  constructor(props){
    super(props);
    this.state = {
      transactions: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      transactionsCount: 0,
      query: '',
      results: []
    };
    
    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
       this.toggle = this.toggle.bind(this);
    }
  
   loadCommentsFromServer() {
    axios.get('/transaction/transactions/' + this.state.currentPage).then(result => {
        if(result.data.code == 200){
          this.setState({
            transactions: result.data.result,
            currentPage: result.data.current,
            PerPage: result.data.perPage,
            totalPages: result.data.pages,
            transactionsCount:result.data.total
          });
        }
      })
      .catch((error) => {		
        if(error.code === 401) {
          this.props.history.push("/login");
        }
      });
  }
  
  componentDidMount() {
    this.loadCommentsFromServer();
    axios.get('/transaction/transactions/' + this.state.currentPage).then(result => {
        if(result.data.code == 200){
			console.log('rsssssssss',result);
          this.setState({
            transactions: result.data.result,
            currentPage: result.data.current,
            PerPage: result.data.perPage,
            totalPages: result.data.pages,
            transactionsCount:result.data.total
          });
        }
      })
   }
  
   transactionDeleteHandler (id){
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }
  
  
  handleInputSearch1 = (startdate) => {
    this.setState({ startDt:startdate.target.value});
  }
  
  handleInputSearch2 = (enddate) => {
    this.setState({ endDt:enddate.target.value });
  }
  
  searchHandler = () => {	  
	   if(this.state.startDt || this.state.endDt) {
		   const data = new FD();
		   data.append('start', this.state.startDt) 
           data.append('end', this.state.endDt) 
           axios.post('/transaction/searchQuery', data).then(result => {
		   console.log('resultsssssssssssss'.result);
		   if(result.data.code === 200) {
				//let transactions = this.state.transactions;       
				//this.loadCommentsFromServer();
			}
		 });
      }   
  }
 
  changeStatusHandler(transaction) {
    transaction.status = (1 - parseInt(transaction.status)).toString();
    axios.post('/transaction/changeStatus', transaction).then(result => {
      if (result.data.code === 200) {
        let transactions = this.state.transactions;
        let transactionIndex = transactions.findIndex(x => x._id === transaction._id);
        transactions[transactionIndex].status = transaction.status.toString();
        this.setState({ transactions: transactions });
        this.loadCommentsFromServer();
      }
    });
  }	
    toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  
  
  render() {
     let transactions,transactionsExcel;
     if(this.state.transactions){
       let listTransaction = this.state.transactions;
       transactions = listTransaction.map((transaction,index) => <Transaction sequenceNo={index} key={transaction._id}  changeStatus={(transaction) => this.changeStatusHandler(transaction)} transaction={transaction}/>);      
     }
    
     let paginationItems =[];
     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;    
     
     
      const dataSet1 = this.state.transactions;
      transactionsExcel = dataSet1.map((transaction,index) => <Transaction sequenceNo={index} key={transaction._id}   transaction={transaction}/>);      
      
     
    return (    
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Transaction Listing       
              </CardHeader>
              <CardBody>
              <Form noValidate>
                 <Row>
                  <Col xs="3">
                    <Input type="date" ref={input => this.startdate = input}  onChange={this.handleInputSearch1} placeholder="Start Date" />
                  </Col>
                  <Col xs="3">
                    <Input type="date" ref={input => this.enddate = input}  onChange={this.handleInputSearch2} placeholder="End Date" />
                  </Col>
                  <Col xs="3">
                    <Button onClick={(e)=>this.searchHandler(e)} color="success" className="px-4">Submit</Button>
                  </Col>
                 
                 <Col xs="3">
                   <ExcelFile element={<button class="mr-1 btn btn-info" aria-hidden="true">Export Excel</button>}>
						<ExcelSheet data={dataSet1} name="transactionId">
							<ExcelColumn label="Transaction Id" value="transactionId"/>
							<ExcelColumn label="Transaction Type" value="transactionType"/>
							<ExcelColumn label="User Id" value="userId"/>
							<ExcelColumn label="Payment Id" value="paymentId"/>
							<ExcelColumn label="Transaction Amount" value="transactionAmount"/>
							<ExcelColumn label="Transaction Date" value="transactionDate"/>
							<ExcelColumn label="Status" value="status"/>
							 
						</ExcelSheet>
				   </ExcelFile>
				   </Col>
				  </Row>
               </Form>
                <Row>&nbsp;</Row>
                <Table hover bordered striped responsive size="sm">
                  <thead>
					  <tr>
						<th>S.No</th>
						<th>Transaction Id</th>
						<th>TransactionType</th>
						<th>UserId</th>
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
                  <ReactPaginate
                    initialPage={this.state.currentPage - 1}
                    previousLabel={"<<"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextLabel={">>"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakLabel={<a href="">...</a>}
                    breakClassName={"break-me"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    pageCount={this.state.totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                  />
                </nav>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} external={externalCloseBtn}>
          <ModalHeader>Transaction</ModalHeader>
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
