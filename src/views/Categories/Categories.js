import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardHeader,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table
} from "reactstrap";
import axios from "axios";
import Category from "./Category";
import ReactPaginate from "react-paginate";
// var passport = require('passport');
//  console.log('passport', passport);
//  require('../../config/passport')(passport);
// console.log('newpassport', passport);

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Categories: [],
      modal: false,
      currentPage: 1,
      PerPage: 1,
      totalPages: 1,
      productsCount: 0,
      message:null
    };
    console.log("THIS OBJ", this);
    if (this.props.match.params.page != undefined) {
      this.setState({ currentPage: this.props.match.params.page });
    }
    this.toggle = this.toggle.bind(this);
    this.approveDeleteHandler = this.approveDeleteHandler.bind(this);
  }

  loadCommentsFromServer() {
    axios
      .get("/category/categories/" + this.state.currentPage)
      .then(result => {
        if (result.data.code === 200) {
          this.setState({
            categories: result.data.result,
            currentPage: result.data.current,
            PerPage: result.data.perPage,
            totalPages: result.data.pages,
            categoriesCount: result.data.total
          });
        }
        console.log('categories result',this.state.categories);
      })
      .catch(error => {
        if (error.code === 401) {
          this.props.history.push("/login");
        }
      });
  }
  
  handlePageClick = data => {
    let currentPage = data.selected + 1;
    this.setState({ currentPage: currentPage }, () => {
      this.loadCommentsFromServer();
    });
  };
  componentDidMount() {
    this.loadCommentsFromServer();
  }
  categoryDeleteHandler(id) {
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }
  changeStatusHandler(category) {
    console.log("category", category);
    category.status = (1 - parseInt(category.status)).toString();
    console.log("CHANGE-STATUS", category);
    axios.post("/category/changeStatus", category).then(result => {
      if (result.data.code === 200) {
        let categories = this.state.categories;
        let categoryIndex = categories.findIndex(x => x._id === category._id);
        categories[categoryIndex].status = category.status.toString();
        this.setState({ categories: categories });
        this.loadCommentsFromServer();
      }
    });
  }
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  approveDeleteHandler() {
    this.setState(
      {
        approve: true
      },
      function() {
        if (this.state.approve) {
          axios
            .delete("/category/deleteCategory/" + this.state.approveId)
            .then(result => {
              if (result.data.code == "200") {
                let categories = this.state.categories;
                let categoryIndex = categories.findIndex(
                  x => x._id === this.state.approveId
                );
                categories.splice(categoryIndex, 1);
                this.setState({
                  categories: categories,
                  approveId: null,
                  approve: false
                });
                this.toggle();
              }else{
				  this.setState({
                  error: true,
                  message: result.data.message
                });
			  }
            });
        }
      }
    );
  }

  render() {
    let categories;
    if (this.state.categories) {
      let categoryList = this.state.categories;
      categories = categoryList.map((category, i) => (
        <Category
          key={category._id}
          srNo={i + 1}
          onDeleteCategory={this.categoryDeleteHandler.bind(this)}
          changeStatus={category => this.changeStatusHandler(category)}
          category={category}
        />
      ));
    }
    let paginationItems = [];
    const externalCloseBtn = (
      <button
        className="close"
        style={{ position: "absolute", top: "15px", right: "15px" }}
        onClick={this.toggle}
      >
        &times;
      </button>
    );
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" /> Categories Listing
                <Link
                  to="categories/add"
                  className="btn btn-success btn-sm pull-right"
                >
                  Add Category
                </Link>
              </CardHeader>
              {(this.state.message && this.state.message !== null)?<div className="alert alert-danger">{this.state.message}</div>:''
		}
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr>
					  <th>S.No.</th>
                      <th>Category Name</th>
                      <th>Description</th>
                      <th>Parent</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>{categories}</tbody>
                </Table>
                <nav>
                  <ReactPaginate
                    initialPage={this.state.currentPage - 1}
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
                    activeClassName={"active"}
                  />
                </nav>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
          external={externalCloseBtn}
        >
         <ModalHeader>Category</ModalHeader>	
         {(this.state.message && this.state.message !== null)?<div className="alert alert-danger">{this.state.message}</div>:''
		}
          <ModalBody>Are you sure to delete?</ModalBody>
          <ModalFooter className="center">
            <Button color="primary" onClick={this.approveDeleteHandler}>
              Yes
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              No
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Categories;
