import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import Trade from './Trade';
import ReactPaginate from 'react-paginate';

// var passport = require('passport');
//  console.log('passport', passport);
//  require('../../config/passport')(passport);
// console.log('newpassport', passport);

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
    console.log('THIS OBJ', this);
    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
    this.toggle = this.toggle.bind(this);
    //this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }
  loadCommentsFromServer() {
    axios.get('/trade/trades/:page').then(result => {
      if(result.data.code == '200'){
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
      if(error.status === 401) {
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
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      this.loadCommentsFromServer()

  }
  changeStatusHandler(trade){
	  console.log("STATUS",trade)
    trade.status = (1 - parseInt(trade.status)).toString();
    console.log("CHANGE-STATUS",trade)
    axios.post('/trade/updateStatus',trade).then(result => {
      if(result.data.code === 200){
        let trades = this.state.trades;
        let tradeIndex = trades.findIndex(x => x._id === trade._id);
        trades[tradeIndex].status = trade.status.toString();
        this.setState({ trades: trades});
      }
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
   let trades;
     if(this.state.trades){
       let tradeList = this.state.trades;
       trades = tradeList.map(trade => <Trade key={trade._id}  changeStatus={(trade) => this.changeStatusHandler(trade)}   trade={trade}/>);
     }

     let paginationItems =[];

     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Trades Listing
                <Link to="trades/add" className="btn btn-success btn-sm pull-right">Add Trade</Link>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>Id</th>
                    <th>SellerName</th>
                    <th>SellerProduct</th>
                    <th>ReceiverName</th>
                    <th>ReceiverProduct</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
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

      </div>

    );
  }
}

export default Trades;
