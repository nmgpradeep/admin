import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import Donation from './Donation';
// var passport = require('passport');
//  console.log('passport', passport);
//  require('../../config/passport')(passport);
// console.log('newpassport', passport);
const port=5001;
axios.defaults.baseURL = window.location.protocol + '//' + window.location.hostname + ':' + port;

class Donations extends Component {
  constructor(props){
    super(props);
    this.state = {
      Donations: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      donationsCount: 0
    };
    //console.log('THIS OBJ', this);
    if(this.props.match.params.page !== undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
    this.toggle = this.toggle.bind(this);
   // this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/donation/donations').then(result => {
		  console.log("DATA",result.data);
        if(result.data.code === 200){
			console.log("DATA200",result.data);
          this.setState({
            donations: result.data.result,
            currentPage: result.data.current,
            PerPage: result.data.perPage,
            totalPages: result.data.pages,
            donationsCount:result.data.total
          });
        }
        console.log("RES",this.state.donations);
      })
      .catch((error) => {
        if(error.status === 401) {
          this.props.history.push("/login");
        }
      });

  }
  //~ productDeleteHandler (id){
    //~ this.setState({
      //~ approve: false,
      //~ approveId: id
    //~ });
    //~ this.toggle();
  //~ }
  //~ changeStatusHandler(product){
    //~ product.productStatus = (1 - parseInt(product.productStatus)).toString();
    //~ axios.post('/products/changeStatus', product).then(result => {
      //~ if(result.data.code === 200){
        //~ let products = this.state.products;
        //~ let productIndex = products.findIndex(x => x._id === product._id);
        //~ products[productIndex].productStatus = product.productStatus.toString();
        //~ this.setState({ products: products});
      //~ }
    //~ });
  //~ }
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  //~ approveDeleteHandler(){
    //~ this.setState({
      //~ approve: true
    //~ }, function(){
      //~ if(this.state.approve){
        //~ axios.delete('/products/deleteProduct/' + this.state.approveId).then(result => {
          //~ if(result.data.code === '200'){
            //~ let products = this.state.products;
            //~ let productIndex = products.findIndex(x => x._id === this.state.approveId);
            //~ products.splice(productIndex, 1);
            //~ this.setState({
              //~ products: products,
              //~ approveId: null,
              //~ approve: false
            //~ });
            //~ this.toggle();
          //~ }
        //~ });
      //~ }
    //~ });
  //~ }
  render() {
   let donations;
     if(this.state.donations){
       let donationList = this.state.donations;
       donations = donationList.map(donation => <Donation key={donation._id}   donation={donation}/>);
     }

     let paginationItems =[];

     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Donations Listing
                <Link to="donations/add" className="btn btn-success btn-sm pull-right">Add Donation</Link>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>User</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Brand</th>
                    <th>Age</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {donations}
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
        
      </div>

    );
  }
}

export default Donations;
