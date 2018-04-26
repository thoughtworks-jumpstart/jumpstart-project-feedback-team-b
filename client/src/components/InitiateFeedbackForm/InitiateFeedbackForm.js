import React from "react";
import { Prompt } from "react-router";
import "./InitiateFeedbackForm.css";
import { ProviderContext, subscribe } from "react-contextual";
import {
  mapMessageContextToProps,
  mapSessionContextToProps,
  messageContextPropType,
  sessionContextPropType
} from "../context_helper";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import FeedbackTemplate from "../FeedbackTemplate/FeedbackTemplate";
import { getTemplateLabels } from "../../actions/formUtils";
import Messages from "../Messages";

class InitiateFeedbackForm extends React.Component {
  constructor() {
    super();
    const feedbackLabels = getTemplateLabels();
    this.state = {
      isChanged: false,
      email: "",
      feedbackLabels: feedbackLabels,
      feedbackValues: new Array(feedbackLabels.length).fill("")
    };
    this.shareHandler = this.shareHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
    ...messageContextPropType,
    ...sessionContextPropType
  };
  componentWillUnmount() {
    this.props.messageContext.clearMessages();
  }

  render() {
    return (
      <div className="content">
        <Messages messages={this.props.messageContext.messages} />
        <Prompt
          when={this.state.isChanged}
          message="Are you sure you want to leave?"
        />
        <div className="panel panel-default">
          <div className="panel-body">
            <div className="template-header">
              <h3>Initiate Feedback</h3>
              <div className="init-save-button">
                <button
                  className="btn btn-primary"
                  onClick={event => this.shareHandler(event)}
                >
                  Share
                </button>
              </div>
            </div>
            <div id="qa-initiateform">
              <form>
                <div>
                  <h4 className="text-muted" htmlFor="email">
                    Receiver's email address:
                  </h4>
                </div>
                <textarea
                  id="InitiateFeedbackForm_emailInput"
                  className="form-control border border-primary"
                  rows={1}
                  name="email"
                  value={this.state.email}
                  onChange={event => this.onChangeHandler(event)}
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

  shareHandler(event) {
    event.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to send feedback to ${this.state.email}?
        \nDo you have permission to initiate the feedback?`
      )
    ) {
      this.submitFeedback({
        email: this.state.email,
        feedbackItems: this.state.feedbackValues
      });
      this.setState({
        isChanged: false,
        email: "",
        feedbackValues: ["", "", ""]
      });
    }
  }

  submitFeedback({ email, feedbackItems }) {
    const messageContext = this.props.messageContext;
    const sessionContext = this.props.sessionContext;
    messageContext.clearMessages();
    return fetch("/api/feedback/initiate", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionContext.token}`
      },
      body: JSON.stringify({
        receiver: email,
        feedbackItems: feedbackItems
      })
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          if (response.status === 200) {
            messageContext.setSuccessMessages([json]);
          } else {
            messageContext.setInfoMessages([json]);
          }
        });
      } else {
        return response.json().then(json => {
          const messages = Array.isArray(json) ? json : [json];
          messageContext.setErrorMessages(messages);
        });
      }
    });
  }
}

const mapContextToProps = context => {
  return {
    ...mapSessionContextToProps(context),
    ...mapMessageContextToProps(context)
  };
};

export default subscribe(ProviderContext, mapContextToProps)(
  withCookies(InitiateFeedbackForm)
);

export { InitiateFeedbackForm };
