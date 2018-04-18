import React from "react";
import { NavLink, Switch, Route } from "react-router-dom";
import "./MyDashboard.css";
import TemplateForm from "../TemplateForm/TemplateForm";
import Messages from "../Messages";
import {
  mapMessageContextToProps,
  messageContextPropType
} from "../context_helper";
import { ProviderContext, subscribe } from "react-contextual";
import Inbox from "../Inbox/Inbox.js";

export class MyDashboard extends React.Component {
  static propTypes = {
    ...messageContextPropType
  };

  componentWillUnmount() {
    this.props.messageContext.clearMessages();
  }

  render() {
    return (
      <div className="info-body">
        <ul className="info-body-sidebar">
          <li>
            <NavLink to="/mydashboard/inbox">Inbox </NavLink>
          </li>
          <li>
            <NavLink to="#">Pending request </NavLink>
          </li>
          <li>
            <NavLink to="/mydashboard/initiate">Initiate Feedback </NavLink>
          </li>
          <li>
            <NavLink to="#">Pending feedback</NavLink>
          </li>
        </ul>
        <div className="info-body-content">
          <Messages messages={this.props.messageContext.messages} />

          <Switch>
            <Route
              path="/mydashboard/initiate"
              exact
              component={TemplateForm}
            />
            <Route path="/mydashboard/inbox" exact component={Inbox} />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapContextToProps = context => {
  return {
    ...mapMessageContextToProps(context)
  };
};

export default subscribe(ProviderContext, mapContextToProps)(MyDashboard);
