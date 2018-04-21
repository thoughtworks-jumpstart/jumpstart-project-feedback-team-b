import { shallow } from "enzyme";
import React from "react";
import FeedbackTemplate from "./FeedbackTemplate";
import FeedbackItemTemplate from "./FeedbackItemTemplate";

describe("FeedbackTemplate test", () => {
  const sampleFeedbackLabels = ["", "", ""];
  const sampleFeedbackValues = new Array(sampleFeedbackLabels.length).fill("");
  it("should render FeedbackTemplate properly", () => {
    const wrapper = shallow(
      <FeedbackTemplate
        labels={sampleFeedbackLabels}
        feedbackValues={sampleFeedbackValues}
      />
    );
    expect(wrapper.find(FeedbackItemTemplate)).toHaveLength(
      sampleFeedbackLabels.length
    );
  });
});
