import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { ProviderContext, subscribe } from "react-contextual";
import {
  mapSessionContextToProps,
  sessionContextPropType,
  messageContextPropType,
  mapMessageContextToProps
} from "../context_helper";
import { object, instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import Messages from "../Messages";
import Loading from "react-loading-animation";
import "./Inbox.css";
import Moment from "moment";

class Inbox extends Component {
  static propTypes = {
    history: object.isRequired,
    cookies: instanceOf(Cookies).isRequired,
    ...messageContextPropType,
    ...sessionContextPropType
  };
  constructor() {
    super();
    this.state = {
      responseStatus: null,
      feedbacks: []
    };
    this.notFetchedData = true;
    this.fetchCall = this.fetchCall.bind(this);
    this.fetchDataOnce = this.fetchDataOnce.bind(this);
  }
  fetchCall() {
    return fetch("/api/feedback?role=receiver&status=receiver", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.sessionContext.token}`
      }
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          this.setState({
            feedbacks: json.receiver,
            responseStatus: true
          });
          // console.log("successfully retrieved list of feedback");
        });
      } else {
        this.setState({
          responseStatus: false
        });
        response
          .json()
          .then(json => this.props.messageContext.setErrorMessages([json]));
        // console.log("some error");
      }
    });
  }
  fetchDataOnce() {
    if (this.notFetchedData && this.props.sessionContext.token !== null) {
      this.notFetchedData = false;
      this.fetchCall();
      //   console.log("fetching dqtq");
    }
  }
  componentWillMount() {
    // console.log("Inbox Mount");
    this.fetchDataOnce();
  }
  componentWillUpdate() {
    // console.log("Incobx update");
    this.fetchDataOnce();
  }
  render() {
    if (this.state.responseStatus === null) {
      return <Loading />;
    } else if (this.state.responseStatus === false) {
      return (
        <div>
          <Messages messages={this.props.messageContext.messages} />
        </div>
      );
    } else {
      return (
        <div className="panel panel-default">
          <div className="panel-body">
            <div className="template-header">
              <h3>Feedback Received</h3>
            </div>
            <table className="table table-hover">
              <thead>
                <tr className="active">
                  <th className="h4">No.</th>
                  <th className="h4">Giver</th>
                  <th className="h4">Date Sent</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {this.state.feedbacks.map((element, idx) => {
                  return (
                    <tr
                      key={idx}
                      className={
                        element.status === "RECEIVER_UNREAD"
                          ? "unreadMessage"
                          : ""
                      }
                    >
                      <td>{idx + 1}</td>
                      <td>{element.giver_name}</td>
                      <td>{Moment(element.updatedAt).format("D MMM YYYY")}</td>
                      <td>
                        <NavLink
                          to={`/mydashboard/inbox/feedback/${element._id}`}
                          className="btn btn-primary"
                          role="button"
                        >
                          View Feedback
                        </NavLink>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
}
const mapContextToProps = context => {
  return {
    ...mapSessionContextToProps(context),
    ...mapMessageContextToProps(context)
  };
};

export default subscribe(ProviderContext, mapContextToProps)(
  withCookies(Inbox)
);

export { Inbox };
