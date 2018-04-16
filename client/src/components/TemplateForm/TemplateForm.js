import React from "react";
import "./TemplateForm.css";
// import { withRouter } from "react-router-dom";

class TemplateForm extends React.Component {
  // componentDidMount() {
  //   this.props.router.setRouteLeaveHook(this.props.route, () => {
  //     if (this.state.unsaved)
  //       return "You have unsaved information, are you sure you want to leave this page?";
  //   });
  //   withRouter(TemplateForm);
  // }

  render() {
    return (
      <div className="content">
        <div className="template-header">
          <h3>
            <strong>Initiate Feedback</strong>
          </h3>
          <div className="init-save-button">
            <button className="btn">Share</button>
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
              <label>What did I do well?</label>
            </div>

            <div className="feedback-form-fields">
              <textarea
                className="form-control border border-primary"
                rows={6}
              />
            </div>
            <br />
            <div>
              <label>What could be better?</label>
            </div>

            <div className="feedback-form-fields">
              <textarea
                className="form-control border border-primary"
                rows={6}
              />
            </div>
            <br />
            <div>
              <label>Suggestions for improvement</label>
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
}

export default TemplateForm;
