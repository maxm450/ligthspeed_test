import React, { Component } from "react";

import { Form, Layout, Row, Table, Divider, notification, Button, Modal, Input } from 'antd';
import {getContacts, deleteContact, createContact, updateContact} from "./services/ContactService";
import "./app.css";

const { Header } = Layout;
const { Column } = Table;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { contacts: [] };
  }

  componentDidMount() {
    getContacts().then((data) => {
      this.setState({contacts: data.contacts})
    }).catch(err => alert(err));
  }

  deleteRecord = (id) => {
    deleteContact(id).then(() => {
      notification.success({
        message: '',
        description: 'Record deleted succesfully',
        duration: 4.5,
      });

      const contacts = this.state.contacts;

      const index = contacts.findIndex((elem) => {
        return elem._id === id;
      });

      if (index > -1) {
        contacts.splice(index, 1);

        this.setState({
          contacts
        })
      }
    }).catch(err => {
      console.log(err);
      notification.error({
        message: '',
        description: 'Enable to delete record',
        duration: 4.5,
      });
    });
  }


  render() {
    return (
      <Layout>
          <Header />
          <Layout>
            <Row type="flex" justify="center">
              <Table dataSource={this.state.contacts}> 
                <Column
                  title="Name"
                  dataIndex="name"
                  key="name"
                />
                <Column
                  title="Email"
                  dataIndex="Email"
                  key="email"
                />
                <Column
                  title="Job title"
                  dataIndex="jobTitle"
                  key="jobTitle"
                />
                <Column
                  title="Action"
                  key="action"
                  render={(text, record) => (
                    <span>
                      <button onClick={() => this.editRecord(record)}>Edit</button>
                      <Divider type="vertical" />
                      <button onClick={() => this.deleteRecord(record._id)}>Delete</button>
                    </span>
                  )} 
                />
              </Table>
            </Row>

          </Layout>
      </Layout>
    );
  }
}
