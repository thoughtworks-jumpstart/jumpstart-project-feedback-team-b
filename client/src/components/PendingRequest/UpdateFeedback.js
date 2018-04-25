import React, { Component } from "react";
import { Prompt } from "react-router";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { ProviderContext, subscribe } from "react-contextual";
import FeedbackTemplate from "../FeedbackTemplate/FeedbackTemplate";
import { getTemplateLabels } from "../../actions/formUtils";
import Messages from "../Messages";
import {
  mapMessageContextToProps,
  mapSessionContextToProps,
  messageContextPropType,
  sessionContextPropType
} from "../context_helper";

class UpdateFeedback extends Component {
  constructor() {
    super();
    const feedbackLabels = getTemplateLabels();
    this.state = {
      isChanged: false,
      responseStatus: false,
      receiver: "",
      feedbackLabels: feedbackLabels,
      feedbackValues: new Array(feedbackLabels.length).fill("")
    };
    this.fetchCall = this.fetchCall.bind(this);
    this.shareHandler = this.shareHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.notFetchedData = true;
  }

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
    ...messageContextPropType,
    ...sessionContextPropType
  };

  fetchCall() {
    let id = this.props.match.params.id;
    return fetch("/api/feedback/" + id, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.sessionContext.token}`
      }
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          this.setState({
            receiver: json.feedback.receiver,
            responseStatus: true
          });
        });
      }
    });
  }
  componentWillUpdate() {
    if (this.notFetchedData && this.props.sessionContext.token !== null) {
      this.notFetchedData = false;
      this.fetchCall();
    }
  }

  render() {
    return (
      <div className="content">
        <Messages messages={this.props.messageContext.messages} />
        <Prompt
          when={this.state.isChanged}
          message="Are you sure you want to leave?"
        />
        <div className="template-header">
          <h3>
            <strong>Pending Feedback Request</strong>
          </h3>
          <div className="init-save-button">
            <button className="btn" onClick={event => this.sendHandler(event)}>
              Send
            </button>
          </div>
        </div>
        <div id="qa-initiateform">
          <form>
            <div>
              <label htmlFor="email">Receiver's email address:</label>
            </div>
            <textarea
              id="InitiateFeedbackForm_emailInput"
              className="form-control border border-primary"
              rows={1}
              name="email"
              value={this.state.email}
              disabled={true}
            />
            <FeedbackTemplate
              labels={this.state.feedbackLabels}
              feedbackValues={this.state.feedbackValues}
              onChangeHandler={this.onFeedbackChangeHandler.bind(this)}
              disabled={false}
            />
          </form>
        </div>
      </div>
    );
  }

  onChangeHandler(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
      isChanged: true
    });
  }

  onFeedbackChangeHandler(idx, event) {
    event.preventDefault();
    let feedbackValues = this.state.feedbackValues;
    feedbackValues[idx] = event.target.value;
    this.setState({
      feedbackValues: feedbackValues
    });
  }

  sendHandler(event) {
    event.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to send feedback to ${this.state.email}?
        \nDo you have permission to initiate the feedback?`
      )
    ) {
      this.setState({ isChanged: false });
      this.submitFeedback({
        receiver: this.state.receiver,
        feedbackItems: this.state.feedbackValues
      });
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
  withCookies(UpdateFeedback)
);
