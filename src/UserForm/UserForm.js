import React from "react";

import { Header, Image, Button } from "semantic-ui-react";
import LoginModal from "../Model/LoginModal";
import SignUpModal from "../Model/SignUpModal";
export default props => (
  <div className="user-form">
    {props.userInfo.email ? (
      <Header>
        <Image
          className="m-right-10"
          circular
          src="https://firebasestorage.googleapis.com/v0/b/logical-fabric.appspot.com/o/usermanage%2Fpatrick.png?alt=media&token=df041a6b-8856-4d41-a5c0-8bc4d9583c8c"
        />
        <span className="m-right-10" id="login-user-email">
          {props.userInfo.email}
        </span>

        <Button onClick={props.toggleSignIn} id="sign-out">
          Sign Out
        </Button>
        <SignUpModal onSignUpSubmit={props.onSignUpSubmit} />
      </Header>
    ) : (
      <Header>
        {props.userInfo.email}
        <LoginModal toggleSignIn={props.toggleSignIn} />
        <SignUpModal onSignUpSubmit={props.onSignUpSubmit} />
      </Header>
    )}
  </div>
);
