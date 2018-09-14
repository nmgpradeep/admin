import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.png'
import sygnet from '../../assets/img/brand/sygnet.svg'
import axios from 'axios'
const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};
class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
			user:{},
			notifications:0,
			notifications:[]
	}
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  logoutHandler = (e) => {
    localStorage.removeItem('jwtToken');
    window.location.reload();
    //this.props.history.push('/login');
  };

   changeStatusHandler(notification){
	notification.isRead = 1;
	//console.log("changeStatusHandler",notification)
    axios.post('/user/readNotification',notification).then(result => {
      if(result.data.code === 200){
		   window.location.reload();
      }
    });
  }

   componentDidMount(){
	axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
	axios.get('/user/getLoggedInUser').then(result => {
		this.setState({
			user:result.data.result,
			notification_type:result.data.notification_type,
			notifications :result.data.notifications,
			totalNotifications:result.data.totalNotifications
		})
	})

  }

  Capitalize(str){
	  //return str.charAt(0).toUpperCase() + str.slice(1);
   }

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (

      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'Pitch&Switch Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'Pitch&Switch Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
         {/* <NavItem className="px-3">
            <NavLink href="/">Dashboard</NavLink>
          </NavItem>

          <NavItem className="px-3">
            <NavLink href="#/users">Users</NavLink>
          </NavItem>*/}

          {/* <NavItem className="px-3">
            <NavLink href="#">Settings</NavLink>
          </NavItem> */}
        </Nav>
        <Nav className="ml-auto" navbar>
         {/*  <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
        <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-location-pin"></i></NavLink>
          </NavItem> */}
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
            <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">{this.state.totalNotifications}</Badge></NavLink>
          </NavItem>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
				 <DropdownItem header tag="div" className="text-center"><strong>You have {this.state.totalNotifications} notifications</strong></DropdownItem>
				  { this.state.notifications.map((notification, i) => {
					   return (<DropdownItem key={i} onClick={this.changeStatusHandler.bind(this,notification)}><i className="icon-user-follow text-success">{' '}{' '}</i>New User Registered<Badge color="info" key={i} style={{right:'1px'}}>{''}{/*this.state.totalNotifications*/}</Badge></DropdownItem>
					   )
					})
				  }
             {/* <DropdownItem><i className="icon-basket-loaded text-primary"></i> New Trade Requested <Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="icon-basket-loaded text-secondary"></i> Trade Rejected<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="icon-note"></i> New Message Received {' '}<Badge color="warning">42</Badge></DropdownItem>*/}

              {/* <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem> */}

              {/* <DropdownItem><i className="fa fa-user" href = "../../views/AdminProfile/Profile.js"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
              <DropdownItem divider />
              <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>
              <DropdownItem onClick={this.logoutHandler}><i className="fa fa-lock"></i> Logout</DropdownItem> */}
            </DropdownMenu>
          </AppHeaderDropdown>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>Welcome <strong>{(this.state.user && (this.state.user !== null || this.state.user !==''))? this.state.user.userName:''} </strong>
              <img src={'assets/img/avatars/6.jpg'} className="img-avatar" alt="admin@pitchandswitch.com" />
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              {/*<DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
               */}
              <DropdownItem><Link to="/admin/myProfile"><i className="fa fa-user"></i> Profile</Link></DropdownItem>
              {/* <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem> */}
              {/*<DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
              <DropdownItem divider />
              <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem> */}
              <DropdownItem onClick={this.logoutHandler}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        {/*<AppAsideToggler className="d-md-down-none" /> */}
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
