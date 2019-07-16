const initialState = {
  isLogin: false,
  userInfo: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "CALL_LOGIN_SUCCESS": {
      const payload = action.payload.userObj;
      console.log("CALL_LOGIN_SUCCESS", payload);
      return {
        ...state,
        isLogin: true,
        userInfo: payload
      };
    }
    case "USER_LOGOUT": {
      //todo... call logout server

      return {
        ...state,
        isLogin: false,
        userInfo: {}
      };
    }
    case "CALL_SIGNUP_SUCCESS": {
      //todo... call logout server
      const payload = action.payload.userObj;

      console.log("CALL_SIGNUP_SUCCESS", payload);
      return {
        ...state,
        isLogin: true,
        userInfo: payload
      };
    }
    default:
      return state;
  }
};
