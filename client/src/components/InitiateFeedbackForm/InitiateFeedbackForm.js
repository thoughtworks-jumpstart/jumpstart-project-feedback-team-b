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
import { object, instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import FeedbackTemplate from "../FeedbackTemplate/FeedbackTemplate";
import { getTemplateLabels } from "../../actions/formUtils";

class InitiateFeedbackForm extends React.Component {
  constructor() {
    super();
    const feedbackLabels = getTemplateLabels();
    this.state = {
      isSaved: false,
      email: "",
      feedbackLabels: feedbackLabels,
      feedbackValues: new Array(feedbackLabels.length).fill("")
    };
    this.shareHandler = this.shareHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }
  static propTypes = {
    history: object.isRequired,
    cookies: instanceOf(Cookies).isRequired,
    ...messageContextPropType,
    ...sessionContextPropType
  };

  render() {
    return (
      <div className="content">
        <Prompt
          when={this.props.isSaved}
          message="Are you sure you want to leave?"
        />
        <div className="template-header">
          <h3>
            <strong>Initiate Feedback</strong>
          </h3>
          <div className="init-save-button">
            <button className="btn" onClick={event => this.shareHandler(event)}>
              Share
            </button>
          </div>
        </div>
        <div>
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
    );
  }

  onChangeHandler(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
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
    this.setState({ isSaved: true });
    this.submitFeedback({
      email: this.state.email,
      feedbackItems: this.state.feedbackValues
    });
  }

  submitFeedback({ email, feedbackItems }) {
    const messageContext = this.props.messageContext;
    const sessionContext = this.props.sessionContext;
    const history = this.props.history;
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
          messageContext.setSuccessMessages([json]);
          history.replace("/mydashboard");
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
