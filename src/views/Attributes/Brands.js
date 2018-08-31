import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Brand from './Brand'
var FD = require('form-data');
var fs = require('fs');


class Brands extends Component {
  constructor(props){
    super(props);
    this.state = {
      brands: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      sortType :1,
      totalPages: 1,
      brandsCount: 0
    };
    console.log('THIS OBJ', this);
    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
    this.toggle = this.toggle.bind(this);
    this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }

  loadCommentsFromServer(){
    axios.get('/brand/brands/' + this.state.currentPage).then(result => {
      if(result.data.code === 200){
        this.setState({
          brands: result.data.result,
          currentPage: result.data.current,
          PerPage: result.data.perPage,
          totalPages: result.data.pages,
          brandsCount:result.data.total
        });
      }
      console.log(this.state.brands);
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
  brandDeleteHandler (id){
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
  
  sortBy(key) {
	 const data = new FD()
        data.append('key', key)
        data.append('page', this.state.currentPage)
        data.append('type', this.state.sortType)
	    axios.post('/brand/sortingBrands',data).then(result => {
		   if(result.data.code ===200){
				this.setState({
				    brands: result.data.result,
				    sortType: result.data.sortType,
					currentPage: result.data.current,
					PerPage: result.data.perPage,
					totalPages: result.data.pages,
					brandsCount:result.data.total
				  });
				}      
			 })
			.catch((error) => {    
			   if(error.code === 401) {
				 this.props.history.push("/login");
			 }
		});
		console.log('ddddd',this.state.brands); 
  }
  
  approveDeleteHandler(){
    this.setState({
      approve: true
    }, function(){
      if(this.state.approve){
        axios.delete('/brand/deleteBrand/' + this.state.approveId).then(result => {
          if(result.data.code == '200'){
            let brands = this.state.brands;
            let brandIndex = brands.findIndex(x => x._id === this.state.approveId);
            brands.splice(brandIndex, 1);
            this.setState({
              brands: brands,
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
   let brands;
   let classValue;
     if(this.state.brands){
       let brandList = this.state.brands;
       brands = brandList.map((brand,index) => <Brand sequenceNo={index} key={brand._id} onDeleteBrand={this.brandDeleteHandler.bind(this)} brand={brand}/>);
     }
      if(this.state.sortType==1){  classValue ="fa fa-sort-asc";}
		else {   classValue ="fa fa-sort-desc";	}

     let paginationItems =[];

     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Brand Listing               
                <Link to="/brand/add" className="btn btn-success btn-sm pull-right">Add New Brand</Link>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>S.No</th>
                    <th><Button color="info" onClick={() => this.sortBy('brandName')} className="mr-1 mousePointer">BrandName
						 <span className ={classValue}></span></Button></th>  
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {brands}
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
          <ModalHeader>Brand</ModalHeader>
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

export default Brands;
