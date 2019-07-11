import React, { Component } from "react"

import { Modal, Form, Button, Divider } from "semantic-ui-react"
export default class LoginModal extends Component {
  state = { modalOpen: false }
  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })

  render() {
    return (
      <Modal
        trigger={<Button onClick={this.handleOpen}>Sign Up</Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header>Sign Up</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths="equal">
              <Form.Field
                label="Username"
                id="signup-username"
                control="input"
                type="email"
                placeholder="Email"
              />
              <Form.Field
                type="password"
                label="Password"
                id="signup-password"
                control="input"
                placeholder=""
              />
            </Form.Group>
            <Button type="submit" onClick={this.props.onSignUpSubmit}>
              Submit
            </Button>
            <Button type="reset" onClick={this.handleClose}>
              Close
            </Button>
            <Divider hidden />
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

// export default props => (
//   <Modal trigger={<Button>Sign Up</Button>}>
//     <Modal.Header>Sign Up</Modal.Header>
//     <Modal.Content>
//       <Form>
//         <Form.Group widths="equal">
//           <Form.Field
//             type="email"
//             label="Username"
//             id="signup-username"
//             control="input"
//             placeholder="Email"
//           />
//           <Form.Field
//             type="password"
//             label="Password"
//             id="signup-password"
//             control="input"
//             placeholder="Password"
//           />
//         </Form.Group>
//         <Button type="submit" onClick={props.onSignUpSubmit}>
//           Submit
//         </Button>
//         <Button type="reset">Clear</Button>
//         <Divider hidden />
//       </Form>
//     </Modal.Content>
//   </Modal>
// )
