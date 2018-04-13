import React from "react";

class TemplateForm extends React.Component {
  render() {
    return (
      <form className="feedback-form">
        <h3 className="text-primary text-center">
          <strong> Receiver's email address: </strong>
        </h3>
        <textarea className="form-control border border-primary" />
        <br />
        <h3 className="text-primary text-center">
          <strong>What did i do well?</strong>
        </h3>

        <div className="feedback-form-fields">
          <textarea className="form-control border border-primary" />
        </div>
        <p />
        <h3 className="text-primary text-center">
          <strong>What could be better?</strong>
        </h3>

        <div className="feedback-form-fields">
          <textarea className="form-control border border-primary" />
        </div>
        <h3 className="text-primary text-center">
          <strong>Suggestions for improvement</strong>
        </h3>
        <div className="feedback-form-fields">
          <textarea className="form-control border border-primary" />
        </div>
      </form>
    );
  }
}

export default TemplateForm;
