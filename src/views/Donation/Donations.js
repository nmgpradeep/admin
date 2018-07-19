import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import Donation from './Donation'
import ReactPaginate from 'react-paginate';

class Donations extends Component {
  constructor(props){
    super(props);
    this.state = {
      donations: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      donationsCount: 0
    };
    console.log('THIS OBJ', this);
    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
    this.toggle = this.toggle.bind(this);
    this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }

  loadCommentsFromServer(){
    axios.get('/donation/donations/' + this.state.currentPage).then(result => {
      if(result.data.code === 200){
        this.setState({
          donations: result.data.result,
          currentPage: result.data.current,
          PerPage: result.data.perPage,
          totalPages: result.data.pages,
          donationsCount:result.data.total
        });
      }
      console.log(this.state.donations);
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
  donationDeleteHandler (id){
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }
  changeStatusHandler(donation){
	  console.log("STATUS",donation)
    donation.productStatus = (1 - parseInt(donation.productStatus)).toString();
    console.log("CHANGE-STATUS",donation)
    axios.post('/donation/updateStatus',donation).then(result => {
      if(result.data.code === 200){
        let donations = this.state.donations;
        let donationIndex = donations.findIndex(x => x._id === donation._id);
        donations[donationIndex].productStatus = donation.productStatus.toString();
        this.setState({ donations: donations});
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
        axios.delete('/donation/deleteDonation/' + this.state.approveId).then(result => {
          if(result.data.code == '200'){
            let donations = this.state.donations;
            let donationIndex = donations.findIndex(x => x._id === this.state.approveId);
            donations.splice(donationIndex, 1);
            this.setState({
              donations: donations,
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
   let donations;
     if(this.state.donations){
       let donationList = this.state.donations;
       donations = donationList.map((donation,index) => <Donation sequenceNo={index} key={donation._id} onDeleteDonation={this.donationDeleteHandler.bind(this)} changeStatus={(donation) => this.changeStatusHandler(donation)}   donation={donation}/>);
     }

     let paginationItems =[];

    const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Donation Listing
                {/* <Link to="/add" className="btn btn-success btn-sm pull-right">Add User</Link> */}
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Product Name</th>  
                    <th>Description</th>                
                    <th>Category</th>
                    <th>User</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Brand</th>
                    <th>Age</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {donations}
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

export default Donations;
