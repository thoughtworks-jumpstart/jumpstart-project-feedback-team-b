import React from "react";
import { Prompt } from "react-router";
import "./TemplateForm.css";
import { ProviderContext, subscribe } from "react-contextual";
import {
  mapMessageContextToProps,
  mapSessionContextToProps,
  messageContextPropType,
  sessionContextPropType
} from "../context_helper";
import { object, instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import * as formUtils from "../../actions/formUtils";

export class TemplateForm extends React.Component {
  constructor() {
    super();
    this.state = {
      isSaved: true,
      email: "",
      feedbackItem1: "",
      feedbackItem2: "",
      feedbackItem3: ""
    };
    this.shareHandler = this.shareHandler.bind(this);
  }
  static propTypes = {
    history: object.isRequired,
    cookies: instanceOf(Cookies).isRequired,
    ...messageContextPropType,
    ...sessionContextPropType
  };

  render() {
    return (
      <div id="qa-templateform" className="content">
        <Prompt
          when={this.state.isSaved}
          message="Are you sure you want to leave?"
        />
        <div className="template-header">
          <h3>
            <strong>Initiate Feedback</strong>
          </h3>
          <div className="init-save-button">
            <button className="btn" onClick={this.shareHandler}>
              Share
            </button>
          </div>
        </div>
        <div>
          <form>
            <div>
              <label>Receiver's email address:</label>
            </div>
            <textarea
              className="form-control border border-primary"
              rows={1}
              name="email"
              value={this.state.email}
              onChange={this.onChangeHandler.bind(this)}
            />
            <br />
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
              />
            </div>
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

  shareHandler(event) {
    event.preventDefault();
    if (
      window.confirm(
        `you sure you want to send feedback to ${this.state.email}?`
      )
    ) {
      this.setState({ isSaved: false });
      formUtils.share({
        email: this.state.email,
        feedbackItem1: this.state.feedbackItem1,
        feedbackItem2: this.state.feedbackItem2,
        feedbackItem3: this.state.feedbackItem3,
        history: this.props.history,
        messageContext: this.props.messageContext,
        sessionContext: this.props.sessionContext
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
  withCookies(TemplateForm)
);
