import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Form, Modal, Input, Upload, Icon, notification} from 'antd';
import {createContact, updateContact} from "../services/ContactService";

const FormItem = Form.Item;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

class EditContactModal extends Component {
  constructor(props) {
    super(props);
    this.state = {imageUrl: null};
  }

  handleCancel = () => {
    this.props.form.resetFields();
    this.setState({
      imageUrl: null
    });
    this.props.onCancel();
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
          
        if (this.props.isEditting) {
          const id = this.props.contact._id;

          updateContact(id, values).then((record) => {
            notification.success({
              message: '',
              description: 'Record updated successfully',
              duration: 4.5,
            });
      
            this.props.onSuccess(record);
          }).catch(err => {
              debugger;
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
              description: 'Record added successfully',
              duration: 4.5,
            });
      
            this.props.onSuccess(record);
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
        <div>
            <Modal
              title={this.props.isEditting ? "Edit contact" : "Create contact"}
              okText={this.props.isEditting ? "Edit" : "Create"}
              visible={this.props.showModal}
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
                      initialValue: this.props.contact.imageUrl
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
                          ) : this.props.contact.avatar ? (
                            <img src={`/public/images/${this.props.contact.avatar}`} alt="avatar" />
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
                      initialValue: this.props.contact.name
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
                      initialValue: this.props.contact.jobTitle
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
                      initialValue: this.props.contact.address
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
                      initialValue: this.props.contact.phoneNumbers && 
                                    this.props.contact.phoneNumbers.length > 1 && 
                                    this.props.contact.phoneNumbers[0].number ? this.props.contact.phoneNumbers[0].number : ""
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
                      initialValue: this.props.contact.phoneNumbers && 
                                    this.props.contact.phoneNumbers.length > 2 && 
                                    this.props.contact.phoneNumbers[1].number ? this.props.contact.phoneNumbers[1].number : ""
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
                      initialValue: this.props.contact.email,
                    })(
                      <Input maxLength={80}/>
                    )}
                  </FormItem>
                </Form> 
              </div> 
            </Modal>
        </div>
    );
  }
}

EditContactModal.propTypes = {
    contact: PropTypes.object,
    isEditting: PropTypes.bool,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    showModal: PropTypes.bool.isRequired,
};

EditContactModal.defaultProps = {
    contact: {
        "name": "",
        "jobTitle": "",
        "address": "",
        "phoneNumbers": [],
        "email": "",
        "picture": ""
    },
    isEditting: false
};

export default Form.create()(EditContactModal);