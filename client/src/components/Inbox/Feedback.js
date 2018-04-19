import React from "react";

class Feedback extends React.Component {
  // let id = props.match.params.id;
  constructor() {
    super();
    this.state = {
      feedback: { feedbackItems: [] }
    };
  }
  fetchCall() {
    fetch("/api/feedback/5ad70e4916492a09c0b96fa2", {
      method: "get",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        response.json().then(json => {
          this.setState({
            feedback: json.feedback
          });
        });
      })
      .catch(error => {
        throw new Error(error);
      });
  }
  async componentDidMount() {
    await this.fetchCall();
  }

  render() {
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

export default Feedback;
