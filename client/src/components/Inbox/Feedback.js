import React from "react";
import {
  ProviderContext,
  subscribe
} from "react-contextual/dist/react-contextual";

const Feedback = props => {
  let id = props.match.params.id;
  fetch("/api/feedback/" + id, {
    method: "get",
    headers: { "Content-Type": "application/json" }
  })
    .then(response => {
      if (response.ok) {
        return (
          <div>
            <div className="template-header">
              <h3>
                <strong>Feedback</strong>
              </h3>
            </div>
            <form>
              <div>
                <label htmlFor="email">Receiver's email address:</label>
              </div>
              <textarea
                className="form-control border border-primary"
                rows={1}
                name="email"
                value={this.state.email}
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
                  value={response.body.feedback.feedbackItems[0]}
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
                  value={response.body.feedback.feedbackItems[1]}
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
                  value={response.body.feedback.feedbackItems[2]}
                  name="feedbackItem3"
                  disabled
                />
              </div>
            </form>
          </div>
        );
      }
    })
    .catch(err => {
      return <div>Invalid Page</div>;
    });
};

export default subscribe(ProviderContext)(Feedback);
