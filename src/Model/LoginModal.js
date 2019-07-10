import React from "react"

import { Modal, Form, Button, Divider } from "semantic-ui-react"
export default props => (
  <Modal trigger={<Button>Login</Button>}>
    <Modal.Header>Login</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Group widths="equal">
          <Form.Field
            label="Username"
            id="login-username"
            control="input"
            placeholder=""
          />
          <Form.Field
            label="Password"
            id="login-password"
            control="input"
            placeholder=""
          />
        </Form.Group>
        <Button type="submit" onClick={props.toggleSignIn}>
          Submit
        </Button>
        <Button type="reset">Cancel</Button>
        <Divider hidden />
      </Form>
    </Modal.Content>
  </Modal>
)
