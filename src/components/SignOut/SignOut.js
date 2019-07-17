import React from "react";

import { Button } from "semantic-ui-react";

import { connect } from "react-redux";
import { logout } from "../../redux/actions";

const SignOut = props => (
  <Button onClick={props.logout} id="sign-out">
    Sign Out
  </Button>
);

export default connect(
  null,
  { logout }
)(SignOut);
