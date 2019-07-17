import React from "react";

import { Modal, Form, Button, Divider } from "semantic-ui-react";

import { connect } from "react-redux";
import { login } from "../../redux/actions";

class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
    this.usernameRef = React.createRef();
    this.psdRef = React.createRef();

    this.onSubmit = this.onSubmit.bind(this);
  }
  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });

  onSubmit = e => {
    e.preventDefault();
    //...todo use ref instead later
    const un = e.target.querySelector("#login-username").value;
    const psd = e.target.querySelector("#login-password").value;

    this.props.login(un, psd);
  };

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
          <Form onSubmit={this.onSubmit}>
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
            <Button type="submit" id="toggle-login">
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

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  { login }
)(LoginModal);
