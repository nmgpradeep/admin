import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Trade from './Trade'
var FD = require('form-data');

class Trades extends Component {
  constructor(props){
    super(props);
    this.state = {
      trades: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      tradesCount: 0
    };
   
    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
     this.toggle = this.toggle.bind(this);
  }

  loadCommentsFromServer(){
    axios.get('/trade/switchedTrades/' + this.state.currentPage).then(result => {	
      if(result.data.code === 200){
        this.setState({
          trades: result.data.result,
          currentPage: result.data.current,
          PerPage: result.data.perPage,
          totalPages: result.data.pages,
          tradesCount:result.data.total
        });
      }
      console.log(this.state.trades);
    })
    .catch((error) => {
       console.log('error', error)
        if(error.code === 401) {
        this.props.history.push("/login");
      }
    });

  }

  handlePageClick = (data) => {
    let currentPage = data.selected + 1;
    this.setState({currentPage: currentPage}, () => {
      this.loadCommentsFromServer();
    });
};
  
  componentDidMount() {
     axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      this.loadCommentsFromServer();
  }
  
  //~ changeStatusHandler(trade){
    //~ trade.status = (1 - parseInt(trade.status)).toString();
    //~ console.log("CHANGE-STATUS",trade)
    //~ axios.post('/trade/updateStatus',trade).then(result => {
      //~ if(result.data.code === 200){
        //~ let trades = this.state.trades;
        //~ let tradeIndex = trades.findIndex(x => x._id === trade._id);
        //~ trades[tradeIndex].status = trade.status.toString();
        //~ this.setState({ trades: trades });
        //~ this.loadCommentsFromServer();
      //~ }
    //~ });
  //~ }
  
   shippingStatus = (e, objId) => {
     const updateData = new FD();
     var objectValue = e.target.value;
     updateData.append('_id',objId);
     updateData.append('value', objectValue);
     updateData.append('field','shippingStatus');     
        axios.post('/trade/updateShippingStatus',updateData).then(result => {
         if(result.data.code === 200){
              var objIndex = this.state.trades.findIndex((trade)=>{
                return objId === trade._id;
              });
              const trades = [...this.state.trades];
              if(objectValue =="4"){
				  trades[objIndex].status = "2";
			  }
              trades[objIndex].shippingStatus = objectValue;
              this.setState({
                trades: trades
              });
            }
      });
  }
  
   returnRaisedStatus = (e, objId) => {
     const updateData = new FD();
     var objectValue = e.target.value;
     updateData.append('_id',objId);
     updateData.append('value', objectValue);
     updateData.append('field','status');     
        axios.post('/trade/updateShippingStatus',updateData).then(result => {
         if(result.data.code === 200){
              var objIndex = this.state.trades.findIndex((trade)=>{
                return objId === trade._id;
              });
              const trades = [...this.state.trades];
              trades[objIndex].status = objectValue;
              this.setState({
                trades: trades
              });
            }
      });
  }
  
  //~ returnRaisedHandler(trade){
    //~ trade.id = trade._id;
    //~ axios.post('/trade/returnraised',trade).then(result => {
      //~ if(result.data.code === 200){
        //~ this.loadCommentsFromServer();
      //~ }
    //~ });
  //~ }
  
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  
  render() {
   let trades;
     if(this.state.trades){
       let tradeList = this.state.trades;
      // trades = tradeList.map((trade,index) => <Trade sequenceNo={index} key={trade._id}  updateStatus={(trade) => this.changeStatusHandler(trade)} returnRaised = {(trade) => this.returnRaisedHandler(trade)}   trade={trade}/>);
       trades = tradeList.map((trade,index) => <Trade sequenceNo={index} key={trade._id}  changeShippingStatus={this.shippingStatus} returnRaised = {this.returnRaisedStatus}   trade={trade}/>);
     }

     let paginationItems =[];
     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Trade Listing               
                {/* <Link to="/trades/add" className="btn btn-success btn-sm pull-right">Add New Trade</Link> */}
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Seller Name</th>  
                    <th>Seller Product</th>   
                    <th>Receiver Name</th> 
                    <th>Receiver Product</th> 
                    <th>Date</th>           
                    <th>Shipping Status</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {trades}
                  </tbody>
                </Table>
                <nav>
                    <ReactPaginate
                       initialPage={this.state.currentPage-1}
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
                       activeClassName={"active"} />
                  </nav>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} external={externalCloseBtn}>
          <ModalHeader>Trade</ModalHeader>
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

export default Trades;
