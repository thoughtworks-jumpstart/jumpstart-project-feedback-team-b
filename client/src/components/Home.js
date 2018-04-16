import React from "react";

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
    return <div className="landing-page">Welcome to myFeedback!!</div>;
  }
}

const mapContextToProps = context => {
  return mapMessageContextToProps(context);
};

export default subscribe(ProviderContext, mapContextToProps)(Home);
