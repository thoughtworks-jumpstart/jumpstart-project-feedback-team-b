import React from "react";
import { Prompt } from "react-router";
import "./RequestFeedbackForm.css";
import { ProviderContext, subscribe } from "react-contextual";
import {
  mapMessageContextToProps,
  mapSessionContextToProps,
  messageContextPropType,
  sessionContextPropType
} from "../context_helper";
import { object, instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import Messages from "../Messages";
import FeedbackTemplate from "../FeedbackTemplate/FeedbackTemplate";
import { getTemplateLabels } from "../../actions/formUtils";

class RequestFeedbackForm extends React.Component {
  constructor() {
    super();
    const feedbackLabels = getTemplateLabels();
    this.state = {
      isChanged: false,
      email: "",
      feedbackLabels: feedbackLabels,
      feedbackValues: new Array(feedbackLabels.length).fill("")
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
  }
  static propTypes = {
    history: object.isRequired,
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
        <div className="template-header">
          <h3>
            <strong>Request Feedback</strong>
          </h3>
          <div className="init-save-button">
            <button
              id="submit_button"
              className="btn qa-request-submit-btn"
              data-cy="requestFeedback-submit"
              onClick={this.submitHandler}
            >
              Send
            </button>
          </div>
        </div>
        <div data-cy="qa-requestfb">
          <form>
            <div>
              <label htmlFor="email">Add email address:</label>
            </div>
            <textarea
              data-cy="RequestFeedbackForm_emailInput"
              className="form-control border border-primary"
              rows={1}
              name="email"
              value={this.state.email}
              onChange={this.onChangeHandler.bind(this)}
            />
            <br />
            <hr className="hr-text" data-content="Preview of feedback form" />
            <FeedbackTemplate
              labels={this.state.feedbackLabels}
              feedbackValues={this.state.feedbackValues}
              // onChangeHandler={this.onFeedbackChangeHandler.bind(this)}
              disabled={true}
            />
          </form>
        </div>
        <Prompt
          when={this.state.isChanged}
          message="Are you sure you want to leave?"
        />
      </div>
    );
  }

  onChangeHandler(event) {
    event.preventDefault();
    this.setState({
      isChanged: true,
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

  submitHandler(event) {
    event.preventDefault();
    this.submitRequest({
      email: this.state.email
    });
  }

  submitRequest({ email }) {
    const messageContext = this.props.messageContext;
    const sessionContext = this.props.sessionContext;
    messageContext.clearMessages();
    return fetch("/api/feedback/request", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionContext.token}`
      },
      body: JSON.stringify({
        giver: email
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
  withCookies(RequestFeedbackForm)
);

export { RequestFeedbackForm };
