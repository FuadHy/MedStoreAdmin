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
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import 'assets/plugins/nucleo/css/nucleo.css'
import 'assets/scss/argon-dashboard-react.scss'

import AdminLayout from 'layouts/Admin.js'
import Login from 'views/examples/Login.js'
import './App.css'

ReactDOM.render(
	<BrowserRouter>
		<Switch>
			<Route path="/admin" render={props => <AdminLayout {...props} />} />
			<Route path="/login" render={props => <Login {...props} />} />
			<Redirect from="/" to="/admin/index" />
		</Switch>
	</BrowserRouter>,
	document.getElementById('root')
)
