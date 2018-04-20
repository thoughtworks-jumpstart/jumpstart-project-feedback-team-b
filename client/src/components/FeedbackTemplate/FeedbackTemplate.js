import React from "react";
import FeedbackItemTemplate from "./FeedbackItemTemplate";

const FeedbackTemplate = props => (
  <div>
    {props.labels.map((label, idx) => {
      return (
        <FeedbackItemTemplate
          key={idx}
          label={label}
          // name="feedbackItem1"
          feedbackValue={props.feedbackValues[idx]}
          onChangeHandler={
            props.onChangeHandler && props.onChangeHandler.bind(null, idx)
          }
          disabled={props.disabled}
        />
      );
    })}
  </div>
);

export default FeedbackTemplate;
