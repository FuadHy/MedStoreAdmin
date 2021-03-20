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
// node.js library that concatenates classes (strings)

import Chart from "chart.js";
// react plugin used to create charts

import {

} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
} from "variables/charts.js";

import { Link } from 'react-router-dom'
import Header from "components/Headers/Header.js";

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import MessageIcon from '@material-ui/icons/Message';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

class Index extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activeNav: 1,
      chartExample1Data: "data1"
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }
  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data:
        this.state.chartExample1Data === "data1" ? "data2" : "data1"
    });
  };
  render() {
    return (
      <>
        <Header />
        <div className="dashboard-cont">
          <Link to='/admin/request' className="dash-links">
            <ShoppingCartIcon className="dash-icon">Filled</ShoppingCartIcon>
            <h4>Request</h4>
          </Link>
          <Link to='/admin/processedRequest' className="dash-links">
            <LocalShippingIcon className="dash-icon">Filled</LocalShippingIcon>
            <h4>Processed Request</h4>
          </Link>
          <Link to='/admin/message' className="dash-links">
            <MessageIcon className="dash-icon">Filled</MessageIcon>
            <h4>Message</h4>
          </Link>
          <Link to='/admin/processedMessage' className="dash-links">
            <ChatBubbleIcon className="dash-icon">Filled</ChatBubbleIcon>
            <h4>Processed Message</h4>
          </Link>
        </div>

      </>
    );
  }
}

export default Index;
