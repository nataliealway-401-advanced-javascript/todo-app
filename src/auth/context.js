import React from "react";
import jwt from "jsonwebtoken";
import cookie from "react-cookies";

export const LoginContext = React.createContext();


/**
 * @class LoginProvider
 * Context for authentication and authorization
 */
class LoginProvider extends React.Component {
  constructor(props) {
    super(props);
    const qs = new URLSearchParams(window.location.search);
    const cookieToken = cookie.load("auth");
    const token = qs.get("token") || cookieToken || null;

    console.log(token);

    this.state = {
      loggedIn: !!token,
      token: token,
      login: this.login,
      logout: this.logout
    };
    console.log(this.state);
  }

  /**
   * Login
   * @params token
   */
  login = token => {
    cookie.save("auth", token);
    this.setLoginState(true);
  };

  /**
   *  Logout
   */
  logout = () => {
    cookie.remove("auth");
    this.setLoginState(false);
  };

  /**
   * Handles state changes with login status
   * @params loggedIn
   */
  setLoginState = loggedIn => {
    let token = cookie.load("auth");
    this.setState({ token, loggedIn });
  };

  render() {
    return (
      <LoginContext.Provider value={this.state}>
        {this.props.children}
      </LoginContext.Provider>
    );
  }
}

export default LoginProvider;
