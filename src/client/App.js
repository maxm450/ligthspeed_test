import React, { Component } from "react";

import { Form, Layout, Row, notification, Button} from 'antd';
import {getContacts, deleteContact} from "./services/ContactService";

import ContactList from './components/ContactList';
import EditContactModal from './components/EditContactModal';

import "./app.css";

const { Header } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      contacts: [],
      modalVisible: false,
      editableValues: {},
      isEditting: false 
    };
  }

  componentDidMount() {
    getContacts().then((data) => {
      this.setState({contacts: data.contacts})
    }).catch(err => alert(err));
  }

  editRecord = (record) => {
    this.setState({
      modalVisible: true,
      editableValues: record,
      isEditting: true
    });
  }

  addRecord = () => {
    this.setState({
      modalVisible: true,
      editableValues: {
        "name": "",
        "jobTitle": "",
        "address": "",
        "phoneNumbers": [],
        "email": "",
        "picture": ""
      },
      isEditting: false
    });
  }

  deleteRecord = (record) => {
    deleteContact(record._id).then(() => {
      notification.success({
        message: '',
        description: 'Record deleted successfully',
        duration: 4.5,
      });

      const contacts = this.state.contacts;

      const index = contacts.findIndex((elem) => {
        return elem._id === record._id;
      });

      if (index > -1) {
        contacts.splice(index, 1);

        this.setState({
          contacts
        })
      }
    }).catch(err => {
      notification.error({
        message: '',
        description: 'Enable to delete record',
        duration: 4.5,
      });
    });
  }

  onCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  onSuccess = (record) => {
    if (this.state.isEditting) {
      const id = this.state.editableValues._id;
      const contacts = this.state.contacts;
      const index = contacts.findIndex((elem) => {
        return elem._id === id;
      });

      if (index > -1) {
        contacts[index] = record.contact;

        this.setState({
          contacts
        })
      }
    } else {
      const contacts = this.state.contacts;
      contacts.push(record.contact);

      this.setState({
        contacts
      });
    }  
  }

  render() {
    return (
      <Layout>
          <Header />
          <Layout>
            <Row type="flex" justify="center">
              <Button type="primary" onClick={this.addRecord}>
                Add contact
              </Button>
            </Row>
            <Row type="flex" justify="center">
              <ContactList
                contacts={this.state.contacts}
                onEdit={this.editRecord}
                onDelete={this.deleteRecord}
              />
            </Row>

            <EditContactModal 
              contact={this.state.editableValues}
              isEditting={this.state.isEditting}
              showModal={this.state.modalVisible}
              onSuccess={this.onSuccess}
              onCancel={this.onCancel}
            />
          </Layout>
      </Layout>
    );
  }
}

export default Form.create()(App);