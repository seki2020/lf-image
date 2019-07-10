import React from "react"

import { Modal, Form, Button, Divider } from "semantic-ui-react"
export default props => (
  <Modal trigger={<Button>Sign Up</Button>}>
    <Modal.Header>Sign Up</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Group widths="equal">
          <Form.Field
            label="Username"
            id="signup-username"
            control="input"
            placeholder=""
          />
          <Form.Field
            label="Password"
            id="signup-password"
            control="input"
            placeholder=""
          />
        </Form.Group>
        <Button type="submit" onClick={props.onSignUpSubmit}>
          Submit
        </Button>
        <Button type="reset">Cancel</Button>
        <Divider hidden />
      </Form>
    </Modal.Content>
  </Modal>
)
