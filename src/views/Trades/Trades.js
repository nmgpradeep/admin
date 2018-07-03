import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import Trade from './Trade';
// var passport = require('passport');
//  console.log('passport', passport);
//  require('../../config/passport')(passport);
// console.log('newpassport', passport);
<<<<<<< HEAD

=======
>>>>>>> 2891207836c09bc97c5043e13d320644c6c0407a
class Trades extends Component {
  constructor(props){
    super(props);
    this.state = {
      users: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      usersCount: 0
    };
    console.log('THIS OBJ', this);
    if(this.props.match.params.page != undefined){
      this.setState({currentPage: this.props.match.params.page});
    }
    this.toggle = this.toggle.bind(this);
    //this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/trade/trades/:page').then(result => {
        if(result.data.code == '200'){
          this.setState({
            users: result.data.result,
            currentPage: result.data.current,
            PerPage: result.data.perPage,
            totalPages: result.data.pages,
            usersCount:result.data.total
          });
        }
        console.log(this.state.users);
      })
      .catch((error) => {
		  console.log('error', error)
        if(error.status === 401) {
          this.props.history.push("/login");
        }
      });

  }


  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
   let users;
     if(this.state.users){
       let userList = this.state.users;
       users = userList.map(user => <Trade key={user._id}  changeStatus={(user) => this.changeStatusHandler(user)}   user={user}/>);
     }

     let paginationItems =[];

     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Trades Listing
                {/*<Link to="users/add" className="btn btn-success btn-sm pull-right">Add User</Link> */}
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>Id</th>
                    <th>SellerName</th>
                    <th>SellerProduct</th>
                    <th>ReceiverName</th>
                    <th>ReceiverProduct</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
<<<<<<< HEAD
                  {users}
=======
                  {/*users*/}
>>>>>>> 2891207836c09bc97c5043e13d320644c6c0407a
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

                    <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                  </Pagination>
                </nav>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>

    );
  }
}

export default Trades;
