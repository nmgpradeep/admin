import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import CmsPage from './CmsPage';
// var passport = require('passport');
//  console.log('passport', passport);
//  require('../../config/passport')(passport);
// console.log('newpassport', passport);

class CmsPages extends Component {
  constructor(props){
    super(props);
    this.state = {
      cmsPages: [],
      modal: false,
      currentPage: 1,
      PerPage: 5,
      totalPages: 1,
      cmsPagesCount: 0
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
      axios.get('/page/pages/:page').then(result => {
		console.log("before STATE",this.state.cmsPages);
        if(result.data.code === 200){
          this.setState({
            cmsPages: result.data.result,
            currentPage: result.data.current,
            PerPage: result.data.perPage,
            totalPages: result.data.pages,
            cmsPagesCount:result.data.total
          });
        }
       
      })
      .catch((error) => {
		  console.log('error', error)
        if(error.status === 401) {
          this.props.history.push("/login");
        }
      });

  }
 
  cmsPageDeleteHandler (id){
    this.setState({
      approve: false,
      approveId: id
    });
    this.toggle();
  }
  
   changeStatusHandler(cmspage){
    cmspage.status = (1 - parseInt(cmspage.status)).toString();    
    axios.post('/page/updateStatus', cmspage).then(result => {
      if(result.data.code === 200){
        let cmsPages = this.state.cmsPages;
        let pageIndex = cmsPages.findIndex(x => x._id === cmspage._id);
        cmsPages[pageIndex].status = cmspage.status.toString();
        this.setState({ cmsPages: cmsPages});
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
        axios.delete('/page/deletePage/' + this.state.approveId).then(result => {
          if(result.data.code === 200){
            let cmsPages = this.state.cmsPages;
            let pageIndex = cmsPages.findIndex(x => x._id === this.state.approveId);
            cmsPages.splice(pageIndex, 1);
            this.setState({
              cmsPages: cmsPages,
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
   let cmsPages;
     if(this.state.cmsPages){
       let pageList = this.state.cmsPages;
       cmsPages = pageList.map(cmsPage => <CmsPage key={cmsPage._id} onDeleteCmsPage={this.cmsPageDeleteHandler.bind(this)} changeStatus={(cmsPage) => this.changeStatusHandler(cmsPage)}   cmsPage={cmsPage}/>);
     }
     

     let paginationItems =[];

    const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> CMS Page Listing
                <Link to="/pages/add" className="btn btn-success btn-sm pull-right">Add New Page</Link>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>Title</th>
                    <th>Heading</th>
                    <th>Content</th>                  
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>                  
                  {cmsPages}
                  </tbody>
                </Table>
                <nav>
                  <Pagination>
                    <PaginationItem>
                      <PaginationLink previous tag="button">Prev</PaginationLink>
                    </PaginationItem>
                    {/*paginationItems*/}

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

export default CmsPages;
