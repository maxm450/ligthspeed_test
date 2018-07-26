import React, { Component } from "react";

import { Form, Layout, Row, notification, Button, Modal, Input, Upload, Icon, message  } from 'antd';
import {getContacts, deleteContact, createContact, updateContact} from "./services/ContactService";

import ContactList from './components/ContactList';

import "./app.css";

const { Header } = Layout;
const FormItem = Form.Item;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

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

  handleCancel = () => {
    this.props.form.resetFields();
    this.setState({
      modalVisible: false,
      imageUrl: null
    });
  };

  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.avatar && values.avatar.file) {
          values.avatar = values.avatar.file.name;
        }

        values.phoneNumbers = [
          {number: values.primaryPhoneNumber},
          {number: values.secondaryPhoneNumber}
        ]
          
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

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    function beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJPG && isLt2M;
    }
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
                          {imageUrl ? (
                            <img src={imageUrl} alt="avatar" />
                          ) : this.state.editableValues.avatar ? (
                            <img src={`/public/images/${this.state.editableValues.avatar}`} alt="avatar" />
                          ) : uploadButton}
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
                      <Input maxLength={80}/>
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
                      <Input maxLength={80}/>
                    )}
                  </FormItem>
                  <FormItem
                    label="Primary phone number"
                    hasFeedback={true}
                  >
                    {getFieldDecorator('primaryPhoneNumber', {
                      rules: [{ 
                        required: true, 
                        message: 'Not valid, must follow XXX-XXX-XXXX', 
                        whitespace: true,
                        pattern: new RegExp(/^\d{3}-\d{3}-\d{4}$/)
                      }],
                      initialValue: this.state.editableValues.phoneNumber
                    })(
                      <Input maxLength={12}/>
                    )}
                  </FormItem>
                  <FormItem
                    label="Secondary phone number"
                    hasFeedback={true}
                  >
                    {getFieldDecorator('secondaryPhoneNumber', {
                      rules: [{ 
                        message: 'Not valid, must follow XXX-XXX-XXXX', 
                        whitespace: true,
                        pattern: new RegExp(/^\d{3}-\d{3}-\d{4}$/)
                      }],
                      initialValue: this.state.editableValues.phoneNumber
                    })(
                      <Input maxLength={12}/>
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
                      <Input maxLength={80}/>
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