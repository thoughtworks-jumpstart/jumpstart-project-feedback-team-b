import React from "react";
import { NavLink, Switch, Route } from "react-router-dom";
import "./MyDashboard.css";
import InitiateFeedbackForm from "../InitiateFeedbackForm/InitiateFeedbackForm";
import {
  mapSessionContextToProps,
  sessionContextPropType,
  messageContextPropType,
  mapMessageContextToProps
} from "../context_helper";
import { ProviderContext, subscribe } from "react-contextual";

import RequestFeedbackForm from "../RequestFeedbackForm/RequestFeedbackForm";
import ShowFeedback from "../Inbox/ShowFeedback";
import UpdateFeedback from "../PendingRequest/UpdateFeedback";
import Inbox from "../Inbox/Inbox";
import PendingRequest from "../PendingRequest/PendingRequest";
export class MyDashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      location: "/mydashboard",
      unread_feedback: 0
    };
    this.fetchCall = this.fetchCall.bind(this);
  }
  static propTypes = {
    ...messageContextPropType,
    ...sessionContextPropType
  };

  componentWillUnmount() {
    this.props.messageContext.clearMessages();
  }

  componentWillUpdate() {
    if (this.props.sessionContext.token !== null) {
      this.fetchCall("receiver", "receiver");
    }
  }
  fetchCall(role, status) {
    return fetch(`/api/feedback?role=${role}&status=${status}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.sessionContext.token}`
      }
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          const unreadFeedback = json.receiver.filter(
            feedback => feedback.status === "RECEIVER_UNREAD"
          ).length;

          if (this.state.unread_feedback !== unreadFeedback) {
            this.setState({
              unread_feedback: unreadFeedback
            });
          }
        });
      } else {
        this.setState({
          unread_feedback: 0
        });
        response
          .json()
          .then(json => this.props.messageContext.setErrorMessages([json]));
      }
    });
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
              Feedback Received
              {this.state.unread_feedback > 0 ? (
                <span className="badge">{this.state.unread_feedback}</span>
              ) : (
                ""
              )}
            </NavLink>
            <NavLink
              className="qa-link list-group-item"
              to="/mydashboard/pendingrequest"
            >
              Incoming Requests
            </NavLink>
            <NavLink className="qa-link list-group-item" to="#">
              Outgoing Requests
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
              path="/mydashboard/pendingrequest"
              component={PendingRequest}
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
    ...mapSessionContextToProps(context),
    ...mapMessageContextToProps(context)
  };
};

export default subscribe(ProviderContext, mapContextToProps)(MyDashboard);
