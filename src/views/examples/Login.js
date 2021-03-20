/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Col,
  Badge
} from "reactstrap";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { API_URL, SERVER_URL } from '../../constants'
import axios from 'axios'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      logging: false,
      success: false
    }
  }

  handleSubmit(e){
    e.preventDefault()
    this.setState({
      ...this.state,
      logging: true
    })
    let formValues = {
      email: this.state.email,
      password: this.state.pass,
      admin: true
    }
    console.log(formValues)
    axios
      .post(`${SERVER_URL}${API_URL}/user/login`, formValues)
      .then(res => {
        if(res.data.status === 'success'){
          console.log(res.data)
          sessionStorage.setItem('admin_token', res.data.token)
          sessionStorage.setItem('username', res.data.data.user.name.split(' ')[0])
          this.setState({
            logging: false,
            success: true,
            initialized: true
          })
          window.location.pathname = '/'
        }
        console.log(res.data)
      })
      .catch(e => {
        console.log(e)
        this.setState({
          logging: false,
          success: false,
          initialized: true
        })
      })
  }

  render() {
    return (
      <div className="admin-login">
      { this.state.logging && <div className="loader-login" data-auth="Logging in..."></div>}
        <div className="login-cont">
          <div className="login-header">
            <AccountCircleIcon className="dash-icon">Filled</AccountCircleIcon>
            <h4>MedStore Admin</h4>
          </div>
          {this.state.initialized && (this.state.success ? (<br />, <Badge color="success">Logging success. Redirecting...</Badge>) : (<br /> , <Badge color="danger">Incorrect email or password!</Badge>))}
          <form onSubmit={this.handleSubmit.bind(this)} className="admin-form">
            <input onChange={(e) => this.setState({
              ...this.state,
              email: e.target.value
            })}
            type="email" placeholder="email" required/>
            <input onChange={(e) => this.setState({
              ...this.state,
              pass: e.target.value
            })} type="password" placeholder="password" required/>
            <button type="submit" name="submit">Login</button>
          </form>
        </div>
      </div>

    );
  }
}

export default Login;
