import React, { Component } from 'react';
import { 
    Badge,
    Col, 
    Nav, 
    NavItem, 
    NavLink, 
    Row, 
    TabContent, 
    TabPane,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    FormGroup,
    Input,
    Label, } from 'reactstrap';

import classnames from 'classnames';
import axios from 'axios';
// import PropTypes from 'prop-types';
class CmsPageView extends Component {
  constructor(props){
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      viewPage: [],
      pageId: this.props.match.params.id
    };
  }
  cancelHandler(){
    this.props.history.push("/pages");
  }
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/page/viewPage/' + this.state.pageId).then(result => {
        if(result.data.code == '200'){
          //localStorage.setItem('jwtToken', result.data.result.accessToken);
          this.setState({ viewPage: result.data.result});
          this.pageTitle.value = result.data.result.pageTitle;
          this.pageHeading.value = result.data.result.pageHeading;
          this.description.value = result.data.result.description;
          //this.bannerImage.value = result.data.result.bannerImage;
        }
      })
      .catch((error) => {
        if(error.status === 401) {
          this.props.history.push("/login");
        }
      });
  }
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }
  render() {
    return(
      <div className = 'animated fadeIn'>
      <Row>
        <Col xs='12' md='12' className='mb-4'>
        <Nav tabs>
        <NavItem>
          <NavLink className={classnames({active: this.state.activeTab === '1'})} onClick={() => {this.toggle('1');}}>
          CMS Page View
          </NavLink>
        </NavItem>
        {/* <NavItem>
          <NavLink className={classnames({active: this.state.activeTab==='2'})} onClick={()=>{this.toggle('2');}}>
            Image
          </NavLink>
        </NavItem> */}
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId='1'>
          <Row>
            <Col xs='12' md='3' className='mb-4'>
              <Label><strong>Page Title:</strong></Label></Col>
              <Col xs='12' md='4'>
              {this.state.viewPage.pageTitle} <br></br></Col>
              <Col xs='12' md='5'>
            <img  src= {'assets/uploads/cmsPageImage/'+this.state.viewPage.bannerImage} width='120'/>
            </Col>
              </Row>
              <Row>
              <Col xs='12' md='3' className='mb-4'>
              <Label><strong>Page Heading:</strong></Label></Col>
              <Col xs='12' md='4'>
              {this.state.viewPage.pageHeading}
              </Col>
          </Row>
          <Row>
          <Col xs='12' md='3'>
          <Label><strong>Page Content:</strong></Label></Col>
          <Col xs='12' md='9'>
          {this.state.viewPage.description}
          </Col>
          </Row>
            
          </TabPane>
          {/* <TabPane tabId='2'>
                <Col xs="12" sm="12">
                  <img  src= {'assets/uploads/cmsPageImage/'+this.state.viewPage.bannerImage} width='700'/>
                </Col>
          </TabPane> */}
        </TabContent>
        </Col>
      </Row>
      </div>
    );

    // return (
    //   <div className="animated fadeIn">
    //     <Row>
    //       <Col xs="12" sm="12">
    //         <Card>
    //           <CardHeader>
    //             <strong>CMS Pages</strong>
    //             <small> View</small>
    //           </CardHeader>
    //           <CardBody>
    //             <FormGroup>
    //               <Label htmlFor="id">ID</Label>
    //               <Input type="text" value={this.state.viewPage._id} />
    //             </FormGroup>
    //             <Row>
    //               <Col xs="4" sm="12">
    //                 <FormGroup>
    //                   <Label htmlFor="company">Advertisement name</Label>
    //                   <Input type="text" value={this.state.viewPage.pageTitle} />
    //                 </FormGroup>
    //                 </Col>
    //                 {/* <Col xs="4" sm="12">
    //                 <FormGroup>
    //                   <Label htmlFor="middlename">Middle name</Label>
    //                   <Input type="text" value={this.state.viewUser.middleName} />
    //                 </FormGroup>
    //                 </Col>
    //                 <Col xs="4" sm="12">
    //                 <FormGroup>
    //                   <Label htmlFor="lastname">Last name</Label>
    //                   <Input type="text" value={this.state.viewUser.lastName} />
    //                 </FormGroup>
    //               </Col> */}
    //             </Row>
    //             <FormGroup>
    //               <Label htmlFor="username">Description</Label>
    //               <Input type="text" value={this.state.viewPage.pageHeading} />
    //             </FormGroup>
    //             <FormGroup>
    //               <Label htmlFor="email">URL</Label>
    //               <Input type="url"  pattern="(http|https)://.+" value={this.state.viewPage.description} required/>
    //             </FormGroup>
    //             <FormGroup>
    //             <Col xs="12" className="text-left">
    //               <Label htmlFor="status">Image</Label>
    //                </Col>
    //               <Col xs="12" sm="12">
    //               <img className="linkedin" src= {'assets/uploads/cmsPageImage/'+this.state.viewPage.bannerImage} width="60"/>
    //               </Col>
                  
    //             </FormGroup>
    //             <Row>
    //               <Col xs="6" className="text-right">
    //                 <Button onClick={()=>this.cancelHandler()} color="primary" className="px-4">Cancel</Button>
    //               </Col>
    //               <Col xs="6">

    //               </Col>
    //             </Row>
    //           </CardBody>
    //         </Card>
    //       </Col>
    //     </Row>
    //     </div>
    // );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default CmsPageView;
