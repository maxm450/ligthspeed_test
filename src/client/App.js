import React, { Component } from "react";

import { Form, Layout, Row, Table, Divider, notification, Button, Modal, Input } from 'antd';
import "./app.css";

const { Header } = Layout;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { username: null };
  }


  render() {
    return (
      <Layout>
          <Header />
          <Layout>
            Hello world
          </Layout>
      </Layout>
    );
  }
}
