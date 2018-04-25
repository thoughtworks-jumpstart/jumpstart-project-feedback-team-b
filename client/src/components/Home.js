import React from "react";
import { NavLink } from "react-router-dom";
import { object } from "prop-types";
import { ProviderContext, subscribe } from "react-contextual";
import {
  mapMessageContextToProps,
  messageContextPropType
} from "../components/context_helper";

class Home extends React.Component {
  static propTypes = {
    history: object.isRequired,
    ...messageContextPropType
  };

  componentWillUnmount() {
    this.props.messageContext.clearMessages();
  }

  render() {
    // return <div className="landing-page">Welcome to myFeedback!!</div>;
    return (
      <div className="container">
        <div class="jumbotron">
          <h1>Are you ready for some feedback?</h1>
          <p>Send feedback or request feedback to improve!</p>
          <p>
            <NavLink
              to="/signup"
              className="btn btn-primary btn-lg"
              role="button"
            >
              Sign up now!
            </NavLink>
          </p>
        </div>
      </div>
    );
  }
}

const mapContextToProps = context => {
  return mapMessageContextToProps(context);
};

export default subscribe(ProviderContext, mapContextToProps)(Home);
