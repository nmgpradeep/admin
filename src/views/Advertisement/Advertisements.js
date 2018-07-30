import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Advertisement from './Advertisement'


class Advertisements extends Component {
  constructor(props){
    super(props);
    this.state = {
      advs: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      advsCount: 0,
      offset: 0
    };
    console.log('THIS OBJ', this);
    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
    this.toggle = this.toggle.bind(this);
    this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }

  loadCommentsFromServer() {
    axios.get('/advertisement/advertisements/' + this.state.currentPage).then(result => {
      if(result.data.code === 200){
        this.setState({
          advs: result.data.result,
          currentPage: result.data.current,
          PerPage: result.data.perPage,
          totalPages: result.data.pages,
          advsCount:result.data.total
        });
      }
      console.log(this.state.advs);
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
  advDeleteHandler (id){
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }
  changeStatusHandler(adv){
	  console.log("STATUS",adv)
    adv.status = (1 - parseInt(adv.status)).toString();
    console.log("CHANGE-STATUS",adv)
    axios.post('/advertisement/updateStatus',adv).then(result => {
      if(result.data.code === 200){
        let advs = this.state.advs;
        let advIndex = advs.findIndex(x => x._id === adv._id);
        advs[advIndex].status = adv.status.toString();
        this.setState({ advs: advs});
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
        axios.delete('/advertisement/deleteAds/' + this.state.approveId).then(result => {
          if(result.data.code == '200'){
            let advs = this.state.advs;
            let advIndex = advs.findIndex(x => x._id === this.state.approveId);
            advs.splice(advIndex, 1);
            this.setState({
              advs: advs,
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
   let advs;
     if(this.state.advs){
       let advList = this.state.advs;
       advs = advList.map((adv,index) => <Advertisement sequenceNo={index}  key={adv._id} onDeleteAdv={this.advDeleteHandler.bind(this)} changeStatus={(adv) => this.changeStatusHandler(adv)}   adv={adv}/>);
     }

     let paginationItems =[];

     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Advertisements Listing
                <Link to="/advertisement/add" className="btn btn-success btn-sm pull-right">Add New Advertisement</Link>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>  
                    <th>Description</th> 
                    <th>URL</th>               
                    <th>Logo</th>
                    
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {advs}
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
          <ModalHeader>Advertisement</ModalHeader>
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

export default Advertisements;
