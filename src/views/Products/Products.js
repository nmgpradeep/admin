import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import Product from './Product';
import ReactPaginate from 'react-paginate';
var FD = require('form-data');


class Products extends Component {
  constructor(props){
    super(props);
    this.state = {
      Products: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      productsCount: 0
    };    
    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
    this.toggle = this.toggle.bind(this);
    this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }
  
   loadCommentsFromServer() {
      axios.get('/product/products/'+this.state.currentPage).then(result => {		
        if(result.data.code === 200){
          this.setState({
            products: result.data.result,
            currentPage: result.data.current,
            PerPage: result.data.perPage,
            totalPages: result.data.pages,
            productsCount:result.data.total
          });
        }
        console.log(this.state.products);
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
       this.loadCommentsFromServer();
  }
  
  productDeleteHandler (id){	
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }
  
  changeStatusHandler(product){
	console.log('product',product);
    product.productStatus = (1 - parseInt(product.productStatus)).toString();
    console.log('CHANGE-STATUS',product);
    axios.post('/product/changeStatus', product).then(result => {
      if(result.data.code === 200){
        let products = this.state.products;
        let productIndex = products.findIndex(x => x._id === product._id);
        products[productIndex].productStatus = product.productStatus.toString();
        this.setState({ products: products});
        this.loadCommentsFromServer();
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
        axios.delete('/product/deleteProduct/' + this.state.approveId).then(result => {
          if(result.data.code == '200'){
            let products = this.state.products;
            let productIndex = products.findIndex(x => x._id === this.state.approveId);
            products.splice(productIndex, 1);
            this.setState({
              products: products,
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
   let products;
     if(this.state.products){
       let productList = this.state.products;
        products = productList.map((product,index) => <Product key={product._id} onDeleteProduct={this.productDeleteHandler.   bind(this)} changeStatus={(product) => this.changeStatusHandler(product)}  product={product} sequenceNumber={index+1}/>);
      }
      
     let paginationItems =[];
     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Products Listing
                <Link to="products/add" className="btn btn-success btn-sm pull-right">Add Product</Link>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>User</th>                  
                    <th>Age Of Item</th>
                    <th>Images</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {products}
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
          <ModalHeader>Product</ModalHeader>
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
export default Products;
