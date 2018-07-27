import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Testimonial from './Testimonial'


class Testimonials extends Component {
  constructor(props){
    super(props);
    this.state = {
      testimonials: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      testimonialsCount: 0
    };
    console.log('THIS OBJ', this);
    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
    this.toggle = this.toggle.bind(this);
    this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }

  loadCommentsFromServer(){
    axios.get('/testimonial/Testimonials/' + this.state.currentPage).then(result => {
      if(result.data.code === 200){
        this.setState({
          testimonials: result.data.result,
          currentPage: result.data.current,
          PerPage: result.data.perPage,
          totalPages: result.data.pages,
          testimonialsCount:result.data.total
        });
      }
      console.log(this.state.testimonials);
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
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      this.loadCommentsFromServer();
  }
  testimonialDeleteHandler (id){
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }
  changeStatusHandler(testimonial){
	  console.log("STATUS",testimonial)
    testimonial.status = (1 - parseInt(testimonial.status)).toString();
    console.log("CHANGE-STATUS",testimonial)
    axios.post('/testimonial/updateStatus',testimonial).then(result => {
      if(result.data.code === 200){
        let testimonials = this.state.testimonials;
        let testimonialIndex = testimonials.findIndex(x => x._id === testimonial._id);
        testimonials[testimonialIndex].status = testimonial.status.toString();
        this.setState({ testimonials: testimonials });
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
        axios.delete('/testimonial/deleteTestimonial/' + this.state.approveId).then(result => {
          if(result.data.code == '200'){
            let testimonials = this.state.testimonials;
            let testimonialIndex = testimonials.findIndex(x => x._id === this.state.approveId);
            testimonials.splice(testimonialIndex, 1);
            this.setState({
              testimonials: testimonials,
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
   let testimonials;
     if(this.state.testimonials){
       let testimonialList = this.state.testimonials;
       testimonials = testimonialList.map((testimonial,index) => <Testimonial sequenceNo={index} key={testimonial._id} onDeleteTestimonial={this.testimonialDeleteHandler.bind(this)} changeStatus={(testimonial) => this.changeStatusHandler(testimonial)}   testimonial={testimonial}/>);
     }

     let paginationItems =[];

     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Testimonial Listing               
                <Link to="/testimonial/add" className="btn btn-success btn-sm pull-right">Add New Testimonial</Link>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Title</th>  
                    <th>Description</th>                
                    <th>Author</th>
                    <th>Review</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {testimonials}
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
          <ModalHeader>Testimonial</ModalHeader>
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

export default Testimonials;
