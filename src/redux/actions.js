import firebase from "../Config/config";
import ACTION from "./action-const";
export const loginSync = userInfo => ({
  type: ACTION["USER_LOGIN"],
  payload: { userInfo }
});

export const logout = () => {
  return dispatch => {
    return firebase
      .auth()
      .signOut()
      .then(success => {
        dispatch(logoutCallSuccess());
      });
  };
};
const logoutCallSuccess = () => ({
  type: ACTION["USER_LOGOUT"],
  payload: {}
});

//Signin Async
export const login = (username, password) => {
  return dispatch => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then(
        success => {
          dispatch(loginCallSuccess(success.user));
        },
        error => dispatch(loginCallFail(error))
      );
  };
};
const loginCallSuccess = userObj => ({
  type: ACTION["CALL_LOGIN_SUCCESS"],
  payload: {
    userObj
  }
});
const loginCallFail = userObj => ({
  type: ACTION["CALL_LOGIN_ERROR"],
  payload: {
    userObj
  }
});

//Signup async
export const signup = (username, password) => {
  return dispatch => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(username, password)
      .then(
        success => {
          dispatch(signupCallSuccess(success.user));
        },
        error => dispatch(signupCallFail(error))
      );
  };
};
const signupCallSuccess = userObj => ({
  type: ACTION["CALL_SIGNUP_SUCCESS"],
  payload: {
    userObj
  }
});
const signupCallFail = userObj => ({
  type: ACTION["CALL_SIGNUP_ERROR"],
  payload: {
    userObj
  }
});
