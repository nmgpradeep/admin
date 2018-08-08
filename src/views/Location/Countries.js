import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Country from './Country'
class Countries extends Component {
  constructor(props){
    super(props);
    this.state = {
      countries: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      countriesCount: 0
    };
    //console.log('THIS OBJ', this);
    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
    this.toggle = this.toggle.bind(this);
    this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }

  loadCommentsFromServer(){
    axios.get('/location/countries/' + this.state.currentPage).then(result => {
      if(result.data.code === 200){
        this.setState({
          countries: result.data.result,
          currentPage: result.data.current,
          PerPage: result.data.perPage,
          totalPages: result.data.pages,
          countriesCount:result.data.total
        });
      }
      console.log(this.state.countries);
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
  // countrySafeRemove(state_id){
  //   this.setState({
  //     solution: false,
  //     solutionId: state_id
  //   });
  // }`
  countryDeleteHandler (id){
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }
  changeStatusHandler(country){
	  //console.log("STATUS",country)
      country.status = (1 - parseInt(country.status)).toString();
	 //console.log("CHANGE-STATUS",country)
    axios.post('/location/updateStatus',country).then(result => {
      if(result.data.code === 200){
        let countries = this.state.countries;
        let countryIndex = countries.findIndex(x => x._id === country._id);
        countries[countryIndex].status = country.status.toString();
        this.setState({ countries: countries });
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
      // if(this.state.solution){
      //   window.alert('Please delete the state associated with the country first')
      // }
      // else
       if(this.state.approve){
        axios.delete('/location/deleteCountry/' + this.state.approveId).then(result => {
          if(result.data.code == '200'){
            let countries = this.state.countries;
            let countryIndex = countries.findIndex(x => x._id === this.state.approveId);
            countries.splice(countryIndex, 1);
            this.setState({
                countries: countries,
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
   let countries;
     if(this.state.countries){
       let countryList = this.state.countries;
       countries = countryList.map((country,index) => <Country sequenceNo={index} key={country._id} onDeleteCountry={this.countryDeleteHandler.bind(this)} changeStatus={(country) => this.changeStatusHandler(country)}   country={country}/>);
     }

     let paginationItems =[];

     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Country Listing               
                <Link to="/country/add" className="btn btn-success btn-sm pull-right">Add New Country</Link>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Country Name</th>  
                    <th>Country Code</th>                
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {countries}
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
          <ModalHeader>Countries</ModalHeader>
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

export default Countries;
