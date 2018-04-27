import { Inbox } from "./Inbox";
import { Cookies } from "react-cookie";
import { shallow } from "enzyme";
import React from "react";
import Loading from "react-loading-animation";
import Messages from "../Messages";
import FetchMock from "fetch-mock";

describe("Feedback Received", () => {
  let cookies = new Cookies();

  let sessionContext = {
    token: "token",
    user: {},
    saveSession: () => {},
    clearSession: () => {},
    updateUserProfile: () => {}
  };

  let messageContext = {
    messages: {},
    clearMessages: () => {},
    setSuccessMessages: () => {},
    setErrorMessages: () => {},
    setInfoMessages: () => {}
  };

  it("should render <Loading/> when fetch fails and responseStatus is null ", () => {
    const wrapper = shallow(
      <Inbox
        history={{}}
        cookies={cookies}
        sessionContext={sessionContext}
        messageContext={messageContext}
      />
    );
    wrapper.setState({ responseStatus: null });
    expect(wrapper.find(Loading)).toHaveLength(1);
  });
  it("should render <Message/> when responseStatus is false  ", () => {
    const wrapper = shallow(
      <Inbox
        history={{}}
        cookies={cookies}
        sessionContext={sessionContext}
        messageContext={messageContext}
      />
    );
    wrapper.setState({ responseStatus: false });
    expect(wrapper.find(Messages)).toHaveLength(1);
  });

  it("should render <table/> when responseStatus is true", async () => {
    const myEmail = "rec@rec.com";
    FetchMock.get("/api/feedback", {
      status: 200,
      body: {
        receiver: [
          {
            receiver: myEmail,
            giver: "giver1@giver1.com",
            status: "RECEIVER_UNREAD",
            feedbackItems: ["giver1", "giver1", "giver1"],
            feedbackTemplate: {
              type: String,
              default: "0"
            },
            updatedAt: new Date()
          },
          {
            receiver: myEmail,
            giver: "giver2@giver2.com",
            status: "RECEIVER_UNREAD",
            feedbackItems: ["giver2", "giver2", "giver2"],
            feedbackTemplate: {
              type: String,
              default: "0"
            },
            updatedAt: new Date()
          }
        ]
      }
    });
    const wrapper = shallow(
      <Inbox
        history={{}}
        cookies={cookies}
        sessionContext={sessionContext}
        messageContext={messageContext}
      />
    );
    const instance = wrapper.instance();
    await instance.fetchCall();
    wrapper.update();

    expect(instance.state.responseStatus).toBe(true);
    expect(instance.state.feedbacks).toHaveLength(2);

    const myFeedback = instance.state.feedbacks.filter(
      feedback => feedback.receiver === myEmail
    );
    expect(myFeedback).toHaveLength(2);
  });
});
