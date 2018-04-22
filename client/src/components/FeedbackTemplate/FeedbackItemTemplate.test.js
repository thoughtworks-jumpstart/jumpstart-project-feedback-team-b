import { shallow } from "enzyme";
import React from "react";
import FeedbackItemTemplate from "./FeedbackItemTemplate";

describe("FeedbackItemTemplate", () => {
  const sampleLabel = "";
  const sampleFeedbackValue = "Hello";
  it("should render FeedbackItemTemplate properly", () => {
    const wrapper = shallow(
      <FeedbackItemTemplate
        label={sampleLabel}
        feedbackValue={sampleFeedbackValue}
      />
    );
    expect(wrapper.find("label")).toHaveLength(1);
    expect(wrapper.find("label").props().children).toEqual(sampleLabel);
    expect(wrapper.find("textarea")).toHaveLength(1);
    expect(wrapper.find("textarea").props().value).toEqual(sampleFeedbackValue);
  });
  it("onChangehandler should be invoked when there is a change in the text field", () => {
    const mockOnChangeHandler = jest.fn();
    const event = { target: { value: "dummy text" } };
    const wrapper = shallow(
      <FeedbackItemTemplate
        label={sampleLabel}
        feedbackValue={sampleFeedbackValue}
        onChangeHandler={mockOnChangeHandler}
      />
    );

    wrapper
      .find("textarea")
      .props()
      .onChange(event);

    // expect(wrapper.find("textarea").props().feedbackValue).toEqual(event.target.value);
    expect(mockOnChangeHandler).toHaveBeenCalledTimes(1);
  });
});
