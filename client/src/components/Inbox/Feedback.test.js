import fetchMock from "fetch-mock";
import { Feedback } from "./Feedback";
import { Cookies } from "react-cookie";
import { render, shallow } from "enzyme";
import React from "react";

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
    await fetchMock.get("/api/feedback/123", {
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
    expect(inst.state.feedback.status).toEqual("RECEIVER_UNREAD");
    expect(inst.state.feedback.feedbackItems).toHaveLength(3);
    expect(inst.state.feedback.giver).toEqual("giver");
    expect(inst.state.feedback.feedbackItems).toEqual(["abc", "cba", "dgf"]);
  });

  it("structure test", () => {
    const wrapper = shallow(
      <Feedback sessionContext={sessionContext} match={match} />
    );
    console.log(wrapper.dive().find("div.template-header"));
    expect;
  });
});
