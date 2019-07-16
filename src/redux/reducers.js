const initialState = {
  isLogin: false,
  userInfo: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "USER_LOGIN": {
      const { username, password } = action.payload;
      debugger;
      //call auth server with credential
      //todo...

      return {
        ...state,
        isLogin: true,
        userInfo: { username, password }
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
    default:
      return state;
  }
};
