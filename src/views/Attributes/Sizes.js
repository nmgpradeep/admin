import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Size from './Size'
var FD = require('form-data');
var fs = require('fs');


class Sizes extends Component {
  constructor(props){
    super(props);
    this.state = {
      sizes: [],
      modal: false,
      currentPage: 1,
      sortType :1,
      PerPage: 5,
      totalPages: 1,
      sizesCount: 0
    };
    console.log('THIS OBJ', this);
    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
    this.toggle = this.toggle.bind(this);
    this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }

  loadCommentsFromServer(){
    axios.get('/size/sizes/' + this.state.currentPage).then(result => {
      if(result.data.code === 200){
        this.setState({
          sizes: result.data.result,
          currentPage: result.data.current,
          PerPage: result.data.perPage,
          totalPages: result.data.pages,
          sizesCount:result.data.total
        });
      }
      console.log(this.state.sizes);
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

	sortBy(key) {
	    const data = new FD()
        data.append('key', key)
        data.append('page', this.state.currentPage)
        data.append('type', this.state.sortType)
	    axios.post('/size/sortingSizes',data).then(result => {
		   if(result.data.code ===200){
				this.setState({
					  sizes: result.data.result,
					  sortType: result.data.sortType,
					  currentPage: result.data.current,
					  PerPage: result.data.perPage,
					  totalPages: result.data.pages,
					  sizesCount:result.data.total
				  });
				}      
			 })
			.catch((error) => {    
			   if(error.code === 401) {
				 this.props.history.push("/login");
			 }
		});
		console.log('ddddd',this.state.sizes); 
    }
  
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      this.loadCommentsFromServer();
  }
  sizeDeleteHandler (id){
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
  approveDeleteHandler(){
    this.setState({
      approve: true
    }, function(){
      if(this.state.approve){
        axios.delete('/size/deleteSize/' + this.state.approveId).then(result => {
          if(result.data.code == '200'){
            let sizes = this.state.sizes;
            let sizeIndex = sizes.findIndex(x => x._id === this.state.approveId);
            sizes.splice(sizeIndex, 1);
            this.setState({
              sizes: sizes,
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
   let sizes;
   let classValue;
     if(this.state.sizes){
       let sizeList = this.state.sizes;
       sizes = sizeList.map((size,index) => <Size sequenceNo={index} key={size._id} onDeleteSize={this.sizeDeleteHandler.bind(this)} size={size}/>);
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
                <i className="fa fa-align-justify"></i> Size Listing               
                <Link to="/size/add" className="btn btn-success btn-sm pull-right">Add New Size</Link>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>S.No</th>
                    <th><Button color="info" onClick={() => this.sortBy('brandName')} className="mr-1 mousePointer">Sizes
						 <span className ={classValue}></span></Button></th>  
                    <th>Category</th>                
                    
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {sizes}
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
          <ModalHeader>Size</ModalHeader>
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

export default Sizes;
