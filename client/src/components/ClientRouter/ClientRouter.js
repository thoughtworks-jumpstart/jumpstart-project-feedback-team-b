import React from "react";
import Home from "../Home";
import NotFound from "../NotFound";
import Login from "../Account/Login";
import Signup from "../Account/Signup";
import Profile from "../Account/Profile";
import Forgot from "../Account/Forgot";
import Reset from "../Account/Reset";
import UserPage from "../UserPage/UserPage";
import { subscribe } from "react-contextual";
import { Route, Switch, Redirect } from "react-router-dom";

const isAuthenticated = props => props.jwtToken !== null;

const PrivateRoute = subscribe()(({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated(props) ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
));
const ClientRouter = () => {
  return (
    <div>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <PrivateRoute path="/account" component={Profile} />
        <Route path="/forgot" component={Forgot} />
        <Route path="/reset/:token" component={Reset} />
        <PrivateRoute path="/UserPage" component={UserPage} />
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
};

export default ClientRouter;
