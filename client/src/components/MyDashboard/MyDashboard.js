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
import RequestFeedbackForm from "../RequestFeedbackForm/RequestFeedbackForm";
import Feedback from "../Inbox/Feedback";
export class MyDashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      location: "/mydashboard"
    };
  }
  static propTypes = {
    ...messageContextPropType
  };

  componentWillUnmount() {
    this.props.messageContext.clearMessages();
  }

  render() {
    const checkForSuccessMsg =
      this.state.location === this.props.location.pathname;
    return (
      <div className="info-body">
        <ul className="info-body-sidebar">
          <li>
            <NavLink
              data-cy="qa-requestfeedback-link"
              to="/mydashboard/request"
            >
              Request Feedback
            </NavLink>
          </li>

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
          {checkForSuccessMsg && (
            <Messages messages={this.props.messageContext.messages} />
          )}
          <Switch>
            <Route
              path="/mydashboard/inbox/feedback/:id"
              exact
              component={Feedback}
            />
            <Route
              path="/mydashboard/initiate"
              exact
              component={TemplateForm}
            />
            <Route path="/mydashboard/inbox" exact component={Inbox} />
            <Route
              exact
              path="/mydashboard/request"
              component={RequestFeedbackForm}
            />
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
