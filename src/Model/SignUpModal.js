import React, { Component } from "react";

import { Modal, Form, Button, Divider, Ref } from "semantic-ui-react";
import { connect } from "react-redux";
import { signup } from "../redux/actions";

class SignupModal extends Component {
  constructor(props) {
    super(props);

    this.usernameRef = React.createRef();
    this.psdRef = React.createRef();

    this.onSubmit = this.onSubmit.bind(this);
  }
  state = { modalOpen: false };
  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });

  // componentDidMount() {
  //   console.log(this.props)
  // }

  onSubmit = e => {
    e.preventDefault();
    //...todo use ref instead later
    const un = this.usernameRef.current.querySelector("#signup-username").value;
    const psd = this.psdRef.current.querySelector("#signup-password").value;

    this.props.signup(un, psd);
    // this.props.onSignup(un, psd);
  };

  render() {
    return (
      <Modal
        trigger={
          <Button onClick={this.handleOpen} id="signup-btn">
            Sign Up
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header>Sign Up</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths="equal">
              <Ref innerRef={this.usernameRef}>
                <Form.Field
                  label="Username"
                  id="signup-username"
                  control="input"
                  type="email"
                  placeholder="Email"
                />
              </Ref>
              <Ref innerRef={this.psdRef}>
                <Form.Field
                  type="password"
                  label="Password"
                  id="signup-password"
                  control="input"
                  placeholder=""
                />
              </Ref>
            </Form.Group>
            <Button type="submit" onClick={this.onSubmit}>
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
  { signup }
)(SignupModal);
