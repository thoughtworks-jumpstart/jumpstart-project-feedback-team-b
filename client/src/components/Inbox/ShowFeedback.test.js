import fetchMock from "fetch-mock";
import { ShowFeedback } from "./ShowFeedback";
import { Cookies } from "react-cookie";
import { shallow } from "enzyme";
import React from "react";
import Loading from "react-loading-animation";
import FeedbackTemplate from "../FeedbackTemplate/FeedbackTemplate";
import Messages from "../Messages";

describe("Fetch Feedback", async () => {
  let sessionContext = {
    token: "token",
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
  it("should update the state after calling fetch api to retrieve Feedback from database", async () => {
    fetchMock.get("/api/feedback/123", {
      status: 200,
      body: {
        feedback: {
          receiver: "receiver",
          giver: "giver",
          giver_name: "",
          status: "RECEIVER_UNREAD",
          feedbackItems: ["abc", "cba", "dgf"],
          feedbackTemplate: {
            type: String,
            default: "0"
          }
        }
      }
    });
    let match = {
      params: {
        id: 123
      }
    };
    let cookies = new Cookies();
    let sessionContext = {
      token: "token",
      user: {},
      saveSession: () => {},
      clearSession: () => {},
      updateUserProfile: () => {}
    };

    const wrapper = shallow(
      <ShowFeedback
        match={match}
        sessionContext={sessionContext}
        history={{}}
        cookies={cookies}
        messageContext={messageContext}
      />
    );
    const inst = wrapper.instance();
    await inst.fetchCall();

    expect(inst.state.feedbackValues).toHaveLength(3);
    expect(inst.state.giver).toEqual("");
    expect(inst.state.feedbackValues).toEqual(["abc", "cba", "dgf"]);
    wrapper.update();
    expect(wrapper.find(FeedbackTemplate)).toHaveLength(1);
  });

  it("should render loading if giver is not defined", () => {
    const wrapper = shallow(
      <ShowFeedback
        sessionContext={sessionContext}
        match={match}
        messageContext={messageContext}
      />
    );
    wrapper.setState({ giver: null });
    expect(wrapper.find(Loading)).toHaveLength(1);
  });
  it("should render 'ShowFeedback not found' if response status is not okay", () => {
    const wrapper = shallow(
      <ShowFeedback
        sessionContext={sessionContext}
        match={match}
        messageContext={messageContext}
      />
    );
    wrapper.setState({ giver: "someone@somewhere.com" });
    wrapper.setState({ responseStatus: false });
    expect(wrapper.find(Messages)).toHaveLength(1);
  });
});
