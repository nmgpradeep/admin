import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import Category from './Category';
// var passport = require('passport');
//  console.log('passport', passport);
//  require('../../config/passport')(passport);
// console.log('newpassport', passport);
const port=5001;
axios.defaults.baseURL = window.location.protocol + '//' + window.location.hostname + ':' + port;

class Categories extends Component {
  constructor(props){
    super(props);
    this.state = {
      Categories: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      categoriesCount: 0
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
      axios.get('/category/categories').then(result => {
		  console.log("DATA",result.data)
        if(result.data.code == '200'){
          this.setState({
            categories: result.data.result,
            currentPage: result.data.current,
            PerPage: result.data.perPage,
            totalPages: result.data.pages,
            categoriesCount:result.data.total
          });
        }
        console.log(this.state.categories);
      })
      .catch((error) => {
        if(error.response.status === 401) {
          this.props.history.push("/login");
        }
      });

  }
  categoryDeleteHandler (id){
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }
  changeStatusHandler(category){
    category.categoryStatus = (1 - parseInt(category.categoryStatus)).toString();
    axios.post('/category/changeStatus', category).then(result => {
      if(result.data.code === 200){
        let categories = this.state.categories;
        let categoryIndex = categories.findIndex(x => x._id === category._id);
        categories[categoryIndex].categoryStatus = category.categoryStatus.toString();
        this.setState({ categories: categories});
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
        axios.delete('/category/deleteCategory/' + this.state.approveId).then(result => {
          if(result.data.code == '200'){
            let categories = this.state.categories;
            let categoryIndex = categories.findIndex(x => x._id === this.state.approveId);
            categories.splice(categoryIndex, 1);
            this.setState({
              categories: categories,
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
   let categories;
     if(this.state.categories){
       let categoryList = this.state.categories;
       categories = categoryList.map(category => <Category key={category._id} onDeleteCategory={this.categoryDeleteHandler.bind(this)} changeStatus={(category) => this.changeStatusHandler(category)}   category={category}/>);
     }

     let paginationItems =[];

     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Categories Listing
                <Link to="categories/add" className="btn btn-success btn-sm pull-right">Add Category</Link>
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
                  {categories}
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

export default Categories;
