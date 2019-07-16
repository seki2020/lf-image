import React from "react";

import { Header, Image, Button } from "semantic-ui-react";
import LoginModal from "../Model/LoginModal";
import SignUpModal from "../Model/SignUpModal";
import LogoutComp from "../SignOut/SignOut";
import { connect } from "react-redux";

const UserForm = props => (
  <div className="user-form">
    {props.isLogin ? (
      <Header>
        <Image
          className="m-right-10"
          circular
          src="https://firebasestorage.googleapis.com/v0/b/logical-fabric.appspot.com/o/usermanage%2Fpatrick.png?alt=media&token=df041a6b-8856-4d41-a5c0-8bc4d9583c8c"
        />
        <span className="m-right-10" id="login-user-email">
          {props.userInfo.username}
        </span>

        <LogoutComp />

        <SignUpModal onSignUpSubmit={props.onSignUpSubmit} />
      </Header>
    ) : (
      <Header>
        {props.userInfo.email}
        <LoginModal />
        <SignUpModal onSignUpSubmit={props.onSignUpSubmit} />
      </Header>
    )}
  </div>
);

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  isLogin: state.isLogin
});

export default connect(mapStateToProps)(UserForm);
