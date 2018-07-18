import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import City from './City'


class Citys extends Component {
  constructor(props){
    super(props);
    this.state = {
      citys: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      citysCount: 0
    };
    console.log('THIS OBJ', this);
    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
    this.toggle = this.toggle.bind(this);
    this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }

  loadCommentsFromServer(){
    axios.get('/location/Citys/' + this.state.currentPage).then(result => {
      if(result.data.code === 200){
        this.setState({
          citys: result.data.result,
          currentPage: result.data.current,
          PerPage: result.data.perPage,
          totalPages: result.data.pages,
          citysCount:result.data.total
        });
      }
      console.log(this.state.citys);
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
  cityDeleteHandler (id){
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }
  changeStatusHandler(city){
	  console.log("STATUS",city)
    city.status = (1 - parseInt(city.status)).toString();
    console.log("CHANGE-STATUS",city)
    axios.post('/location/changeStatus',city).then(result => {
      if(result.data.code === 200){
        let citys = this.state.citys;
        let cityIndex = citys.findIndex(x => x._id === city._id);
        citys[cityIndex].status = city.status.toString();
        this.setState({ citys: citys });
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
        axios.delete('/location/deleteCity/' + this.state.approveId).then(result => {
          if(result.data.code == '200'){
            let citys = this.state.citys;
            let cityIndex = citys.findIndex(x => x._id === this.state.approveId);
            citys.splice(cityIndex, 1);
            this.setState({
              citys: citys,
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
   let citys;
     if(this.state.citys){
       let cityList = this.state.citys;
       citys = cityList.map(city => <City key={city._id} onDeleteCity={this.cityDeleteHandler.bind(this)} changeStatus={(city) => this.changeStatusHandler(city)}   city={city}/>);
     }

     let paginationItems =[];

     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> City Listing               
                <Link to="/city/add" className="btn btn-success btn-sm pull-right">Add New City</Link>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>Country Name</th>  
                    <th>State Name</th>   
                    <th>City Name</th>             
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {citys}
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

export default Citys;