import React from "react";
import { withCookies } from "react-cookie";
import { ProviderContext, subscribe } from "react-contextual";
import Loading from "react-loading-animation";
import {
  mapSessionContextToProps,
  sessionContextPropType,
  messageContextPropType,
  mapMessageContextToProps
} from "../context_helper";
import FeedbackTemplate from "../FeedbackTemplate/FeedbackTemplate";
import { getTemplateLabels } from "../../actions/formUtils";
import Messages from "../Messages";

export class ShowFeedback extends React.Component {
  constructor() {
    super();
    const feedbackLabels = getTemplateLabels();
    this.state = {
      feedbackValues: new Array(feedbackLabels.length).fill(""),
      feedbackLabels: feedbackLabels,
      giver: "",
      responseStatus: null
    };
    this.fetchCall = this.fetchCall.bind(this);
    this.notFetchedData = true;
  }
  static propTypes = {
    ...sessionContextPropType,
    ...messageContextPropType
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
            giver: json.feedback.giver_name,
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

  componentWillUpdate() {
    if (this.notFetchedData && this.props.sessionContext.token !== null) {
      this.notFetchedData = false;
      this.fetchCall();
    }
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
              <h3>Feedback from {this.state.giver}</h3>
            </div>

            <FeedbackTemplate
              labels={this.state.feedbackLabels}
              feedbackValues={this.state.feedbackValues}
              disabled={true}
            />
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
  withCookies(ShowFeedback)
);
