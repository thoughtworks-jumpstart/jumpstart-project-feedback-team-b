import fetchMock from "fetch-mock";
import { UpdateFeedback } from "./UpdateFeedback";
import { Cookies } from "react-cookie";
import { shallow } from "enzyme";
import React from "react";
import FeedbackTemplate from "../FeedbackTemplate/FeedbackTemplate";
import Loading from "react-loading-animation";

describe("Retrieve Feedback", async () => {
  let sessionContext = {
    token: "token",
    user: {},
    saveSession: () => {},
    clearSession: () => {},
    updateUserProfile: () => {}
  };
  let match = {
    params: {
      id: 123
    }
  };
  let messageContext = {
    messages: {},
    clearMessages: () => {},
    setSuccessMessages: () => {},
    setErrorMessages: () => {},
    setInfoMessages: () => {}
  };

  it("should render the loading component", () => {
    const wrapper = shallow(
      <UpdateFeedback
        match={match}
        cookies={new Cookies()}
        messageContext={messageContext}
        sessionContext={sessionContext}
      />
    );
    expect(wrapper.find(Loading)).toHaveLength(1);
  });

  it("should render the page properly after token is retrieve", async () => {
    const wrapper = shallow(
      <UpdateFeedback
        match={match}
        cookies={new Cookies()}
        messageContext={messageContext}
        sessionContext={sessionContext}
      />
    );
    wrapper.setState({
      responseStatus: { receiver: "receiver" }
    });

    expect(wrapper.find("button")).toHaveLength(1);
    expect(wrapper.find("form")).toHaveLength(1);
  });

  it("should have a button to click 'Send' ", () => {
    const wrapper = shallow(
      <UpdateFeedback
        match={match}
        cookies={new Cookies()}
        messageContext={messageContext}
        sessionContext={sessionContext}
      />
    );

    wrapper.setState({
      responseStatus: { receiver: "receiver" }
    });

    wrapper.instance().sendHandler = jest.fn();
    wrapper.update();
    wrapper.instance().forceUpdate();
    wrapper.find("button.btn").simulate("click");
    expect(wrapper.instance().sendHandler).toBeCalled();
  });
});
