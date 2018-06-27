import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import Product from './Product';
// var passport = require('passport');
//  console.log('passport', passport);
//  require('../../config/passport')(passport);
// console.log('newpassport', passport);
const port=5001;
axios.defaults.baseURL = window.location.protocol + '//' + window.location.hostname + ':' + port;

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
    console.log('THIS OBJ', this);
    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
    this.toggle = this.toggle.bind(this);
    this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/product/products').then(result => {
		  console.log("DATA",result.data);
        if(result.data.code == '200'){
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
        if(error.response.code === 401) {
          this.props.history.push("/login");
        }
      });

  }
  productDeleteHandler (id){
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }
  changeStatusHandler(product){
    product.productStatus = (1 - parseInt(product.productStatus)).toString();
    axios.post('/products/changeStatus', product).then(result => {
      if(result.data.code === 200){
        let products = this.state.products;
        let productIndex = products.findIndex(x => x._id === product._id);
        products[productIndex].productStatus = product.productStatus.toString();
        this.setState({ products: products});
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
        axios.delete('/products/deleteProduct/' + this.state.approveId).then(result => {
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
       products = productList.map(product => <Product key={product._id} onDeleteProduct={()=>this.productDeleteHandler.bind(this)} changeStatus={(product) => this.changeStatusHandler(product)}   product={product}/>);
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
                    <th>Name</th>
                    <th>Description</th>
                    <th>Parent</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {products}
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

export default Products;
