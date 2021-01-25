import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Auth from "../routes/Auth";
import AuthRequest from "../routes/AuthRequest";
import Home from "../routes/Home";

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <Router>
      {isLoggedIn ? (
        <Switch>
          <Route
            path="/home"
            component={() => <Home userObj={userObj} />}
            exact
          />
          <Redirect from="*" to="/home" />
        </Switch>
      ) : (
        <Switch>
          <Route path="/login" component={Auth} exact />
          <Route
            path="/authRequest"
            component={() => <AuthRequest userObj={userObj} />}
            exact
          />
          <Redirect from="*" to="/login" />
        </Switch>
      )}
    </Router>
  );
};

export default AppRouter;
