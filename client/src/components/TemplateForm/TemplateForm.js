import React from "react";
import { Prompt } from "react-router";
import "./TemplateForm.css";
// import { withRouter } from "react-router-dom";

class TemplateForm extends React.Component {
  constructor() {
    super();
    this.state = {
      isSaved: false
    };
    this.shareHandler = this.shareHandler.bind(this);
  }
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
            <button className="btn" onClick={this.shareHandler}>
              Share
            </button>
          </div>
        </div>
        <div>
          <form>
            <div>
              <label htmlFor="email">Receiver's email address:</label>
            </div>
            <textarea className="form-control border border-primary" rows={1} />
            <br />
            <div>
              <label>You are doing great at...</label>
            </div>

            <div className="feedback-form-fields">
              <textarea
                className="form-control border border-primary"
                rows={6}
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
              />
            </div>
          </form>
        </div>
      </div>
    );
  }

  shareHandler(event) {
    event.preventDefault();
    this.setState({ isSaved: true });
  }
}

export default TemplateForm;
