import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import Subscription from './Subscription';
import ReactPaginate from 'react-paginate';

class Subscriptions extends Component {
  constructor(props){
    super(props);
    this.state = {
      subscriptions: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      subscriptionsCount: 0,
      offset: 0
    };
    console.log('THIS subscriptions', this);
    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
    this.toggle = this.toggle.bind(this);
    this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }
  loadCommentsFromServer() {
    axios.get('/subscription/subscriptions/' + this.state.currentPage).then(result => {
      if(result.data.code ===200){
		  console.log("SUBS - RESPONCE",result.data.result)
        this.setState({
          subscriptions: result.data.result,
          currentPage: result.data.current,
          PerPage: result.data.perPage,
          totalPages: result.data.pages,
          total_count:result.data.total
        });
        }
      console.log(this.state.subscriptions);
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
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      this.loadCommentsFromServer();

  }
  subscriptionDeleteHandler (id){
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }
  changeStatusHandler(subscription){
    subscription.status = (1 - parseInt(subscription.status)).toString();
    axios.post('/subscription/changeStatus', subscription).then(result => {
      if(result.data.code === 200){
        let subscriptions = this.state.subscriptions;
        let subscriptionIndex = subscriptions.findIndex(x => x._id === subscription._id);
        subscriptions[subscriptionIndex].status = subscription.status.toString();
        this.setState({ subscriptions: subscriptions});
      }
    });
  }
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  approveDeleteHandler(){
    this.setState({
      approve: true
    }, function(){
      if(this.state.approve){
        axios.delete('/subscription/deleteSubscription/' + this.state.approveId).then(result => {
         if(result.data.code == '200'){
            let subscriptions = this.state.subscriptions;
            let subscriptionIndex = subscriptions.findIndex(x => x._id === this.state.approveId);
            subscriptions.splice(subscriptionIndex, 1);
            this.setState({
              subscriptions: subscriptions,
              approveId: null,
              approve: false
            });
           this.toggle();
         }
       });
     }
   });
  }

  render() {
   let subscriptions;
     if(this.state.subscriptions){
       let subscriptionList = this.state.subscriptions;
       subscriptions = subscriptionList.map((subscription,index) => <Subscription sequenceNo={index} key={subscription._id} changeStatus={(subscription) => this.changeStatusHandler(subscription)} onDeleteSubscription={this.subscriptionDeleteHandler.bind(this)} subscription={subscription}/>);
     }

     let paginationItems =[];

     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Subscription Listing
                <Link to="subscriptions/add" className="btn btn-success btn-sm pull-right">Add Subscription</Link>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Subscription Name</th>
                    <th>Description</th>
                    <th>Price($)</th>                  
                    <th>Total Trade Permitted</th>
                    <th>Total Inventory Allowed</th>
                    <th>Time Period(Month)</th>
                    <th>Added On</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {subscriptions}
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
          <ModalHeader>Subscription</ModalHeader>
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

export default Subscriptions;
