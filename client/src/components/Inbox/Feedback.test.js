import fetchMock from "fetch-mock";
import { Feedback } from "./Feedback";
import { shallow } from "enzyme";
import React from "react";

describe("Fetch Feedback", () => {
  it("Retrieve feedback should be called and return 200", async () => {
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
    let sessionContext = {
      token: "token"
    };
    const wrapper = shallow(
      <Feedback match={match} sessionContext={sessionContext} />
    );
    const inst = wrapper.instance();
    await inst.fetchCall();
    expect(inst.state.feedback.status).toEqual("RECEIVER_UNREAD");
    expect(inst.state.feedback.feedbackItems).toHaveLength(3);
  });
});
