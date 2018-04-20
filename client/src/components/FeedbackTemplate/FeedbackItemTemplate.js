import React from "react";

const FeedbackItemTemplate = props => (
  <div>
    <div>
      <label>{props.label}</label>
    </div>

    <div className="feedback-form-fields">
      <textarea
        className="form-control border border-primary"
        rows={6}
        name={props.name}
        value={props.feedbackValue}
        onChange={props.onChangeHandler}
        disabled={props.disabled}
      />
    </div>
  </div>
);

export default FeedbackItemTemplate;
