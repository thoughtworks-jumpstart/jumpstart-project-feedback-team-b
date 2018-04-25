import React from "react";
import "./FeedbackItemTemplate.css";

const FeedbackItemTemplate = props => (
  <div className="feedbackitem">
    <div>
      <h4 className="text-muted">{props.label}</h4>
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
