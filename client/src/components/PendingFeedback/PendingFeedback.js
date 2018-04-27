import React, { Component } from "react";
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
import "../Inbox/Inbox.css";
import Moment from "moment";

class PendingRequest extends Component {
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
    return fetch("/api/feedback?role=receiver&status=giver", {
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
        });
      } else {
        this.setState({
          responseStatus: false
        });
        response
          .json()
          .then(json => this.props.messageContext.setErrorMessages([json]));
      }
    });
  }
  fetchDataOnce() {
    if (this.notFetchedData && this.props.sessionContext.token !== null) {
      this.notFetchedData = false;
      this.fetchCall();
    }
  }
  componentWillMount() {
    this.fetchDataOnce();
  }
  componentWillUpdate() {
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
              <h3>Outgoing Request</h3>
            </div>
            <table className="table table-hover">
              <thead>
                <tr className="active">
                  <th className="h4">No.</th>
                  <th className="h4">Giver</th>
                  <th className="h4">Requested Date</th>
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
                      <td />
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
  withCookies(PendingRequest)
);

export { PendingRequest };
