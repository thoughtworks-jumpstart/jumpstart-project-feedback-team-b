import React from "react";
import { NavLink, Switch, Route } from "react-router-dom";
import "./MyDashboard.css";
import InitiateFeedbackForm from "../InitiateFeedbackForm/InitiateFeedbackForm";
import {
  mapMessageContextToProps,
  messageContextPropType
} from "../context_helper";
import { ProviderContext, subscribe } from "react-contextual";

import RequestFeedbackForm from "../RequestFeedbackForm/RequestFeedbackForm";
import ShowFeedback from "../Inbox/ShowFeedback";
import UpdateFeedback from "../PendingRequest/UpdateFeedback";
import Inbox from "../Inbox/Inbox";
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
    return (
      <div className="info-body">
        <div className="info-body-sidebar">
          <div className="info-body-sidebar-button-group" role="group">
            <NavLink
              className="qa-link btn btn-primary"
              data-cy="qa-requestfeedback-link"
              to="/mydashboard/request"
            >
              Request Feedback
            </NavLink>
            <NavLink
              className="qa-link btn btn-primary"
              to="/mydashboard/initiate"
            >
              Initiate Feedback
            </NavLink>
          </div>

          <div className="list-group">
            <NavLink
              className="qa-link list-group-item"
              to="/mydashboard/inbox"
            >
              Inbox
            </NavLink>
            <NavLink className="qa-link list-group-item" to="#">
              Pending request
            </NavLink>
            <NavLink className="qa-link list-group-item" to="#">
              Pending feedback
            </NavLink>
          </div>
        </div>

        <div className="info-body-content">
          <Switch>
            <Route path="/mydashboard/inbox" exact component={Inbox} />
            <Route
              path="/mydashboard/inbox/feedback/:id"
              exact
              component={ShowFeedback}
            />
            <Route
              className="qa-route"
              path="/mydashboard/initiate"
              exact
              component={InitiateFeedbackForm}
            />
            <Route
              exact
              path="/mydashboard/request"
              component={RequestFeedbackForm}
            />
            <Route
              exact
              path="/mydashboard/pendingrequest/feedback/:id"
              component={UpdateFeedback}
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
