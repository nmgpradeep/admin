import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { AppSwitch } from '@coreui/react'
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';

class EmailNotification extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: {},
      user : {},
      modal: false,     
    };
    console.log('THIS OBJ', this);
   
    this.toggle = this.toggle.bind(this);    
  }

  loadCommentsFromServer(){
    axios.get('/notification/email').then(result => {
      if(result.data.code === 200){
		this.setState({
          emailNotification: result.data.result.emailNotification,
          user:result.data.result          
        });
      
      // console.log('emailNotification',)
      }
      
    })
    .catch((error) => {
    console.log('error', error)
      if(error.code === 401) {
        this.props.history.push("/login");
      }
    });

  }
handleChange(e) {
	  let userD = this.state.user;
	  //this.setState({:e.target.checked})
	  console.log(userD,e.target.checked)
	  userD.emailNotification = ((e.target.checked)?0:1).toString()
	  axios.post('/notification/email',userD).then(result => {	  
		this.setState({
          emailNotification: result.data.result.emailNotification,          
        });
	})
	.catch((error) => {
	console.log('error', error)
	  if(error.code === 401) {
		this.props.history.push("/login");
	  }
	});
}
 
  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      this.loadCommentsFromServer();
  }
  
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  
  render() {
   
     const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Email Notification Setting                           
              </CardHeader>
              <CardBody>
                <Col xs="12" md="6">
					  <CardBody>	
						  <If condition={this.state.emailNotification =="0"}>
							<Then>
							 <AppSwitch className={'mx-1'} variant={'pill'} color={'success'} label checked   onChange={e => this.handleChange(e)}/>	
							</Then>							
							<Else>
							  <AppSwitch className={'mx-1'} variant={'pill'} color={'success'} label unchecked   onChange={e => this.handleChange(e)}/>	
							</Else>
						  </If>		
					  </CardBody>
				  </Col>
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

export default EmailNotification;
