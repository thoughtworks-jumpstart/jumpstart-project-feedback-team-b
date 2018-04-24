import React from "react";
import { withCookies } from "react-cookie";
import { ProviderContext, subscribe } from "react-contextual";
import Loading from "react-loading-animation";
import {
  mapSessionContextToProps,
  sessionContextPropType
} from "../context_helper";

export class Feedback extends React.Component {
  constructor() {
    super();
    this.state = {
      feedback: {
        feedbackItems: [],
        giver: undefined
      },
      responseStatus: false
    };
    this.fetchCall = this.fetchCall.bind(this);
    this.notFetchedData = true;
  }
  static propTypes = {
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
            feedback: json.feedback,
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
    if (this.state.feedback.giver === undefined) {
      return <Loading />;
    } else if (this.state.responseStatus === false) {
      return (
        <div>
          <h1 className="feedbackNotFound">Feedback not found!</h1>
        </div>
      );
    } else {
      return (
        <div>
          <div className="template-header">
            <h3>
              <strong>Feedback</strong>
            </h3>
          </div>
          <form>
            <div>
              <label htmlFor="email">Giver's email address:</label>
            </div>
            <textarea
              className="form-control border border-primary"
              rows={1}
              name="email"
              value={this.state.feedback.giver}
              disabled
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
                value={this.state.feedback.feedbackItems[0]}
                disabled
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
                value={this.state.feedback.feedbackItems[1]}
                disabled
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
                value={this.state.feedback.feedbackItems[2]}
                name="feedbackItem3"
                disabled
              />
            </div>
          </form>
        </div>
      );
    }
  }
}
const mapContextToProps = context => {
  return {
    ...mapSessionContextToProps(context)
  };
};

export default subscribe(ProviderContext, mapContextToProps)(
  withCookies(Feedback)
);
