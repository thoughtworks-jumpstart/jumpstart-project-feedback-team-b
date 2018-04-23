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

class RequestFeedbackForm extends React.Component {
  constructor() {
    super();
    this.state = {
      isChanged: false,
      email: ""
    };
    this.submitHandler = this.submitHandler.bind(this);
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
        <Messages messages={this.props.messageContext.messages} />
        <div className="template-header">
          <h3>
            <strong>Request Feedback</strong>
          </h3>
          <div className="init-save-button">
            <button
              className="btn"
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
            <div>
              <label>You are doing great at...</label>
            </div>

            <div className="feedback-form-fields">
              <textarea
                className="form-control border border-primary"
                rows={6}
                name="feedbackItem1"
                value={this.state.feedbackItem1}
                onChange={this.onChangeHandler.bind(this)}
                disabled={true}
              />
            </div>
            <br />
            <div>
              <label>You could work on/improve...</label>
            </div>
            <div className="feedback-form-fields">
              <textarea
                className="form-control border border-primary"
                rows={6}
                name="feedbackItem2"
                value={this.state.feedbackItem2}
                onChange={this.onChangeHandler.bind(this)}
                disabled={true}
              />
            </div>
            <br />
            <div>
              <label>Suggestions...</label>
            </div>
            <div className="feedback-form-fields">
              <textarea
                className="form-control border border-primary"
                rows={6}
                value={this.state.feedbackItem3}
                name="feedbackItem3"
                onChange={this.onChangeHandler.bind(this)}
                disabled={true}
              />
            </div>
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
