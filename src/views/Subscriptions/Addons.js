import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import Addon from './Addon'


class Addons extends Component {
  constructor(props){
    super(props);
    this.state = {
      addons: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      addonsCount: 0
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
      axios.get('/subscription/list-addon').then(result => {
        if(result.data.code === 200){
          this.setState({
            addons: result.data.result,
            currentPage: result.data.current,
            PerPage: result.data.perPage,
            totalPages: result.data.pages,
            addonsCount:result.data.total
          });
        }
        console.log(this.state.addons);
      })
      .catch((error) => {
		  console.log('error', error)
        if(error.response.code === 401) {
          this.props.history.push("/login");
        }
      });

  }
  addonDeleteHandler (id){
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }
  changeStatusHandler(addon){
	  console.log("STATUS",addon)
    addon.status = (1 - parseInt(addon.status)).toString();
    console.log("CHANGE-STATUS",addon)
    axios.post('/subscription/updateStatus',addon).then(result => {
      if(result.data.code === 200){
        let addons = this.state.addons;
        let addonIndex = addons.findIndex(x => x._id === addon._id);
        addons[addonIndex].status = addon.status.toString();
        this.setState({ addons: addons });
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
        axios.delete('/subscription/deleteAddon/' + this.state.approveId).then(result => {
          if(result.data.code == '200'){
            let addons = this.state.addons;
            let addonIndex = addons.findIndex(x => x._id === this.state.approveId);
            addons.splice(addonIndex, 1);
            this.setState({
              addons: addons,
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
   let addons;
     if(this.state.addons){
       let addonList = this.state.addons;
       addons = addonList.map(addon => <Addon key={addon._id} onDeleteAddon={this.addonDeleteHandler.bind(this)} changeStatus={(addon) => this.changeStatusHandler(addon)}   addon={addon}/>);
     }

     let paginationItems =[];

     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Addon Listing
                <Link to="/addon/add" className="btn btn-success btn-sm pull-right">Add New Addon</Link>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>Package Name</th>  
                    <th>Description</th>                
                    <th>Price</th>
                    <th>Total Trade Permitted</th>
                    <th>Total Inventory Allowed</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {addons}
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

export default Addons;
