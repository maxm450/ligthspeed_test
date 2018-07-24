import React, { Component } from "react";
import PropTypes from 'prop-types';


import {Table, Divider} from 'antd';

const { Column } = Table;

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      contacts: props.contacts,
    };
  }

  editRecord = (record) => {
      this.props.editRecord(record);
  }

  deleteRecord = (record) => {
    this.props.deleteRecord(record);
  }

  render() {
    return (
        <div>
            <Table dataSource={this.props.contacts}> 
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
                      <button onClick={() => this.deleteRecord(record)}>Delete</button>
                    </span>
                  )} 
                />
            </Table>
        </div>
    );
  }
}

ContactList.propTypes = {
    contacts: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default ContactList;