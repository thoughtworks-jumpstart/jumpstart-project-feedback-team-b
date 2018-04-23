import { shallow } from "enzyme";
import { Cookies } from "react-cookie";
import React from "react";
import { InitiateFeedbackForm } from "./InitiateFeedbackForm";
import FeedbackTemplate from "../FeedbackTemplate/FeedbackTemplate";
import FeedbackItemTemplate from "../FeedbackTemplate/FeedbackItemTemplate";

describe("InitiateFeedbackForm test", () => {
  let messageContext = {
    messages: {},
    clearMessages: () => {},
    setSuccessMessages: () => {},
    setErrorMessages: () => {},
    setInfoMessages: () => {}
  };
  let sessionContext = {
    token: null,
    user: {},
    saveSession: () => {},
    clearSession: () => {},
    updateUserProfile: () => {}
  };
  it("should have a button to click 'Share' ", () => {
    const wrapper = shallow(
      <InitiateFeedbackForm
        history={{}}
        cookies={new Cookies()}
        messageContext={messageContext}
        sessionContext={sessionContext}
      />
    );
    expect(wrapper.find("button")).toHaveLength(1);

    wrapper.instance().shareHandler = jest.fn();
    wrapper.update();
    wrapper.instance().forceUpdate();
    wrapper.find("button.btn").simulate("click");
    expect(wrapper.instance().shareHandler).toBeCalled();
  });

  it("should call the onChangeHandler if there are input to the email input textarea", () => {
    const wrapper = shallow(
      <InitiateFeedbackForm
        history={{}}
        cookies={new Cookies()}
        messageContext={messageContext}
        sessionContext={sessionContext}
      />
    );

    const event = { target: { value: "dummy text" } };
    wrapper.instance().onChangeHandler = jest.fn();
    wrapper.update();
    wrapper.instance().forceUpdate();
    const emailInput_Textarea = wrapper.find(
      "textarea#InitiateFeedbackForm_emailInput"
    );
    emailInput_Textarea.simulate("change", event);
    expect(wrapper.instance().onChangeHandler).toBeCalled();
  });

  it("should have a FeedbackTemplate ", () => {
    const wrapper = shallow(
      <InitiateFeedbackForm
        history={{}}
        cookies={new Cookies()}
        messageContext={messageContext}
        sessionContext={sessionContext}
      />
    );

    expect(wrapper.find(FeedbackTemplate)).toHaveLength(1);
  });
});
