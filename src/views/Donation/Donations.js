import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import Donation from './Donation'
import ReactPaginate from 'react-paginate';
var FD = require('form-data');

class Donations extends Component {
  constructor(props){
    super(props);
    this.state = {
      donations: [],
      modal: false,
      currentPage: 1,
      PerPage: 1,
      totalPages: 1,
      donationsCount: 0,
      info: false,
    };

    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
    this.toggle = this.toggle.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
    this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }

  loadCommentsFromServer(){
    axios.get('/donation/donations/' + this.state.currentPage).then(result => {
	  console.log('rs',result.data.result);
      if(result.data.code === 200){
        this.setState({
          donations: result.data.result,
          currentPage: result.data.current,
          PerPage: result.data.perPage,
          totalPages: result.data.pages,
          donationsCount:result.data.total
        });
      }
    })
    .catch((error) => {
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
	   axios.get('/donation/getConstant').then(result => {
           this.setState({conditionsConstant: result.data.result});
       });
      this.loadCommentsFromServer();
  }


  donationDeleteHandler(id){
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }


   toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleInfo (id){
	 this.setState({ info: !this.state.info  });
	 axios.get('/donation/viewuser/' + id).then(result => {
        if(result.data.code === 200){
        this.setState({userData: result.data.result});
      }
    })
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
  shippingStatus = (e, objId) => {
     const updateData = new FD();
     var objectValue = e.target.value;
     updateData.append('_id',objId);
     updateData.append('value', objectValue);
     updateData.append('field','shippingStatus');
        axios.post('/donation/updateStatus',updateData).then(result => {
         if(result.data.code === 200){
              var objIndex = this.state.donations.findIndex((donation)=>{
                return objId === donation._id;
              });
              const donations = [...this.state.donations];
              donations[objIndex].shippingStatus = objectValue;
              this.setState({
                donations: donations
              });
            }
      });
  }
  render() {
   let donations;
     if(this.state.donations){
       let donationList = this.state.donations;
       donations = donationList.map((donation,index) => <Donation sequenceNo={index} key={donation._id} changeShippingStatus={this.shippingStatus} onDeleteDonation={this.donationDeleteHandler.bind(this)}  onflagUsers={this.toggleInfo.bind(this)} changeStatus={(donation) => this.changeStatusHandler(donation)}   donation={donation}/>);
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
                    <th>Shipping Status</th>
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
          <ModalHeader>Donation</ModalHeader>
          <ModalBody>
            Are you sure to delete?
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.approveDeleteHandler}>Yes</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>No</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.info} toggle={this.toggleInfo} className={'modal-info ' + this.props.className}>
		  <ModalHeader toggle={this.toggleInfo}>User Details</ModalHeader>
		  <ModalBody>
		    <tr><td>First Name : {this.state.userData?this.state.userData.firstName:""}</td> </tr>
			<tr><td>Username : {this.state.userData?this.state.userData.userName:""}</td></tr>
			<tr><td>Email : {this.state.userData?this.state.userData.email:""}</td></tr>
			<tr><td>phoneNumber : {this.state.userData?this.state.userData.phoneNumber:""}</td></tr>
			<tr><td>address : {this.state.userData?this.state.userData.address:""}</td></tr>
		  </ModalBody>
		  <ModalFooter>
			<Button color="secondary" onClick={this.toggleInfo}>Cancel</Button>
		  </ModalFooter>
		</Modal>
      </div>

    );
  }
}

export default Donations;
