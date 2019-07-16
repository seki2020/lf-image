import firebase from "../Config/config";

// export const loginSync = (username, password) => ({
//     type: "USER_LOGIN",
//     payload: {
//         username,
//         password
//     }
// });

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
  type: "USER_LOGOUT",
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
  type: "CALL_LOGIN_SUCCESS",
  payload: {
    userObj
  }
});
const loginCallFail = userObj => ({
  type: "CALL_LOGIN_ERROR",
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
  type: "CALL_SIGNUP_SUCCESS",
  payload: {
    userObj
  }
});
const signupCallFail = userObj => ({
  type: "CALL_SIGNUP_ERROR",
  payload: {
    userObj
  }
});
