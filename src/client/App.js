import React, { Component } from "react";

import { Form, Layout, Row, notification, Button, Modal, Input, Upload, Icon } from 'antd';
import {getContacts, deleteContact, createContact, updateContact} from "./services/ContactService";

import ContactList from './components/ContactList';

import "./app.css";

const { Header } = Layout;
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

  deleteRecord = (record) => {
    deleteContact(record._id).then(() => {
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
          createContact(values).then((values) => {
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
    const beforeUpload = () => {};
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
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

            <Modal
              title={this.state.isEditting ? "Edit contact" : "Create contact"}
              okText={this.state.isEditting ? "Edit" : "Create"}
              visible={this.state.modalVisible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <div>
               <Form layout="vertical" onSubmit={this.handleSubmit}> 
               <FormItem
                    label="Avatar"
                    hasFeedback={true}
                  >
                    {getFieldDecorator('avatar', {
                      initialValue: this.state.editableValues.imageUrl
                    })(
                      <Upload
                          name="avatar"
                          listType="picture-card"
                          className="avatar-uploader"
                          showUploadList={false}
                          action="/api/contacts/avatar"
                          beforeUpload={beforeUpload}
                          onChange={this.handleChange}
                        >
                          {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                        </Upload>
                    )}
                  </FormItem>

                  <FormItem
                    label="Name"
                    hasFeedback={true}
                  >
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: 'Not valid', whitespace: true}],
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
                      rules: [{ required: true, message: 'Not valid', whitespace: true}],
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
                      rules: [{ required: true, message: 'Not valid', whitespace: true}],
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
                      rules: [{ 
                        required: true, 
                        message: 'Not valid, must follow XXX-XXX-XXXX', 
                        whitespace: true,
                        pattern: new RegExp(/^\d{3}-\d{3}-\d{4}$/)
                      }],
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
                      rules: [{ required: true, message: 'not a valid email', whitespace: true, type: 'email'}],
                      initialValue: this.state.editableValues.email,
                    })(
                      <Input />
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