import React, { Component } from "react";

import { Form, Layout, Row, Table, Divider, notification, Button, Modal, Input } from 'antd';
import {getContacts, deleteContact, createContact, updateContact} from "./services/ContactService";
import "./app.css";

const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;

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
        "phoneNumber": "",
        "email": "",
        "picture": ""
      },
      isEditting: false
    });
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

  handleCancel = () => {
    this.props.form.resetFields();
    this.setState({
      modalVisible: false
    });
  };

  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.isEditting) {
          const id = this.state.editableValues._id;
          const contacts = this.state.contacts;

          updateContact(id, values).then((record) => {
            notification.success({
              message: '',
              description: 'Record updated succesfully',
              duration: 4.5,
            });
      
            const index = contacts.findIndex((elem) => {
              return elem._id === id;
            });
      
            if (index > -1) {
              contacts[index] = record.contact;
      
              this.setState({
                contacts
              })
            }
          }).catch(err => {
            console.log(err);
            notification.error({
              message: '',
              description: 'Enable to update record',
              duration: 4.5,
            });
          });
        } else {
          createContact(values).then((record) => {
            notification.success({
              message: '',
              description: 'Record added succesfully',
              duration: 4.5,
            });
      
            const contacts = this.state.contacts;
            contacts.push(record.contact);
      
            this.setState({
              contacts
            });
          }).catch(err => {
            console.log(err);
            notification.error({
              message: '',
              description: 'Enable to add record',
              duration: 4.5,
            });
          });
        }

        this.handleCancel();
      }
    });    
  }

  render() {
    const { getFieldDecorator } = this.props.form;

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
              <Table dataSource={this.state.contacts}> 
                <Column
                  title="Name"
                  dataIndex="name"
                  key="name"
                />
                <Column
                  title="Phone number"
                  dataIndex="phoneNumber"
                  key="phoneNumber"
                />
                <Column
                  title="Email"
                  dataIndex="email"
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

            <Modal
              title="Basic Modal"
              visible={this.state.modalVisible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <div>
               <Form layout="vertical" onSubmit={this.handleSubmit}> 
                  <FormItem
                    label="Name"
                    hasFeedback={true}
                  >
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: ' ', whitespace: true}],
                      initialValue: this.state.editableValues.name
                    })(
                      <Input/>
                    )}
                  </FormItem>
                  <FormItem
                    label="Job Title"
                    hasFeedback={true}
                  >
                    {getFieldDecorator('jobTitle', {
                      rules: [{ required: true, message: ' ', whitespace: true}],
                      initialValue: this.state.editableValues.jobTitle
                    })(
                      <Input/>
                    )}
                  </FormItem>
                  <FormItem
                    label="Address"
                    hasFeedback={true}
                  >
                    {getFieldDecorator('address', {
                      rules: [{ required: true, message: ' ', whitespace: true}],
                      initialValue: this.state.editableValues.address
                    })(
                      <Input/>
                    )}
                  </FormItem>
                  <FormItem
                    label="Phone number"
                    hasFeedback={true}
                  >
                    {getFieldDecorator('phoneNumber', {
                      rules: [{ required: true, message: ' ', whitespace: true}],
                      initialValue: this.state.editableValues.phoneNumber
                    })(
                      <Input/>
                    )}
                  </FormItem>
                  <FormItem
                    label="Email"
                    hasFeedback={true}
                  >
                    {getFieldDecorator('email', {
                      rules: [{ required: true, message: ' ', whitespace: true}],
                      initialValue: this.state.editableValues.email
                    })(
                      <Input type="email"/>
                    )}
                  </FormItem>
                </Form> 
              </div> 
            </Modal>

          </Layout>
      </Layout>
    );
  }
}

export default Form.create()(App);