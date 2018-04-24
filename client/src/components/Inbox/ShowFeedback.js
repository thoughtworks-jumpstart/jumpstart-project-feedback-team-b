import React from "react";
import { withCookies } from "react-cookie";
import { ProviderContext, subscribe } from "react-contextual";
import Loading from "react-loading-animation";
import {
  mapSessionContextToProps,
  sessionContextPropType
} from "../context_helper";
import FeedbackTemplate from "../FeedbackTemplate/FeedbackTemplate";
import { getTemplateLabels } from "../../actions/formUtils";

export class ShowFeedback extends React.Component {
  constructor() {
    super();
    const feedbackLabels = getTemplateLabels();
    this.state = {
      feedbackValues: new Array(feedbackLabels.length).fill(""),
      feedbackLabels: feedbackLabels,
      giver: null,
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
            feedbackValues: json.feedback.feedbackItems,
            giver: json.feedback.giver,
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
    if (this.state.giver === null) {
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
              value={this.state.giver}
              disabled
            />
            <FeedbackTemplate
              labels={this.state.feedbackLabels}
              feedbackValues={this.state.feedbackValues}
              disabled={true}
            />
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
  withCookies(ShowFeedback)
);
