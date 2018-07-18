import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import User from './User';
import ReactPaginate from 'react-paginate';
// var passport = require('passport');
//  console.log('passport', passport);
//  require('../../config/passport')(passport);
// console.log('newpassport', passport);

class Users extends Component {
  constructor(props){
    super(props);
    this.state = {
      users: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      usersCount: 0,
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
    axios.get('/user/users/' + this.state.currentPage).then(result => {
      if(result.data.code ===200){
        this.setState({
          users: result.data.result,
          currentPage: result.data.current,
          PerPage: result.data.perPage,
          totalPages: result.data.pages,
          total_count:result.data.total
        });
        }
      console.log(this.state.users);
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
  userDeleteHandler (id){
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }
  changeStatusHandler(user){
    user.userStatus = (1 - parseInt(user.userStatus)).toString();
    axios.post('/user/changeStatus', user).then(result => {
      if(result.data.code === 200){
        let users = this.state.users;
        let userIndex = users.findIndex(x => x._id === user._id);
        users[userIndex].userStatus = user.userStatus.toString();
        this.setState({ users: users});
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
        axios.delete('/user/deleteUser/' + this.state.approveId).then(result => {
          if(result.data.code == '200'){
            let users = this.state.users;
            let userIndex = users.findIndex(x => x._id === this.state.approveId);
            users.splice(userIndex, 1);
            this.setState({
              users: users,
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
   let users;
     if(this.state.users){
       let userList = this.state.users;
       users = userList.map((user,index) => <User key={user._id} onDeleteUser={this.userDeleteHandler.bind(this)} changeStatus={(user) => this.changeStatusHandler(user)}   user={user} sNO={index}/>);
     }
     let paginationItems =[];

     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Users Listing
                <Link to="users/add" className="btn btn-success btn-sm pull-right">Add User</Link>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
					          <th>S.No.</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Date registered</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {users}
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

export default Users;
