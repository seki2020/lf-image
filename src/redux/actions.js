export const login = (username, password) => ({
  type: "USER_LOGIN",
  payload: {
    username,
    password
  }
});

export const logout = () => ({
  type: "USER_LOGOUT",
  payload: {}
});
