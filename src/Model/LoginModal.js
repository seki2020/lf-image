import React, { Component } from "react";

import { Modal, Form, Button, Divider } from "semantic-ui-react";
export default class LoginModal extends Component {
  state = { modalOpen: false };
  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });

  render() {
    return (
      <Modal
        id="login-modal"
        trigger={
          <Button onClick={this.handleOpen} id="login-btn">
            Login
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header>Login</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths="equal">
              <Form.Field
                label="Username"
                id="login-username"
                control="input"
                type="email"
                placeholder="Email"
              />
              <Form.Field
                type="password"
                label="Password"
                id="login-password"
                control="input"
                placeholder=""
              />
            </Form.Group>
            <Button
              type="submit"
              id="toggle-login"
              onClick={this.props.toggleSignIn}
            >
              Submit
            </Button>
            <Button type="reset" onClick={this.handleClose}>
              Close
            </Button>
            <Divider hidden />
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
