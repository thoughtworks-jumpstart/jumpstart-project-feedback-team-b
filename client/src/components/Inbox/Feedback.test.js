import fetchMock from "fetch-mock";
import { Feedback } from "./Feedback";
import { Cookies } from "react-cookie";
import { shallow } from "enzyme";
import React from "react";
import Loading from "react-loading-animation";
import FeedbackTemplate from "../FeedbackTemplate/FeedbackTemplate";

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
  it("should update the state after calling fetch api to retrieve Feedback from database", async () => {
    fetchMock.get("/api/feedback/123", {
      status: 200,
      body: {
        feedback: {
          receiver: "receiver",
          giver: "giver",
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
      <Feedback
        match={match}
        sessionContext={sessionContext}
        history={{}}
        cookies={cookies}
      />
    );
    const inst = wrapper.instance();
    await inst.fetchCall();

    expect(inst.state.feedbackValues).toHaveLength(3);
    expect(inst.state.giver).toEqual("giver");
    expect(inst.state.feedbackValues).toEqual(["abc", "cba", "dgf"]);
    wrapper.update();
    expect(wrapper.find("label")).toHaveLength(1);
    expect(wrapper.find("textarea")).toHaveLength(1);
    expect(wrapper.find(FeedbackTemplate)).toHaveLength(1);
  });

  it("should render loading if giver is not defined", () => {
    const wrapper = shallow(
      <Feedback sessionContext={sessionContext} match={match} />
    );
    wrapper.setState({ giver: null });
    expect(wrapper.find(Loading)).toHaveLength(1);
  });
  it("should render 'Feedback not found' if response status is not okay", () => {
    const wrapper = shallow(
      <Feedback sessionContext={sessionContext} match={match} />
    );
    wrapper.setState({ giver: "someone@somewhere.com" });
    wrapper.setState({ responseStatus: false });
    expect(wrapper.find("h1.feedbackNotFound")).toHaveLength(1);
  });
});
