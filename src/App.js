import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import './App.css';
// Styles
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'

// Containers
import { DefaultLayout } from './containers';
// Pages
import { Login, Page404, Page500, Register } from './views/Pages';

// import { renderRoutes } from 'react-router-config';

//import http from 'http';

const port=5001;
axios.defaults.baseURL = window.location.protocol + '//' + window.location.hostname + ':' + port;

class App extends Component {
  componentDidMount() {
    //
  }

  logout = () => {
    localStorage.removeItem('jwtToken');
    window.location.reload();
  }
  render() {
    return (
      <HashRouter>
        <Switch>

          <Route exact path="/login" exact name="admin Login Page" component={Login} />
          { /*<Route exact path="/register" name="Register Page" component={Register} /> */}
          <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} />
          <Route path="/"  name="Home" component={DefaultLayout} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
