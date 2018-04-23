import { render } from "enzyme";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { MyDashboard } from "./MyDashboard";

jest.mock("../InitiateFeedbackForm/InitiateFeedbackForm.js", () => {
  return () => () => `<div id="qa-initiateroute"></div>`;
});

describe("mydashboard structure Testing", () => {
  it("should find all structure element", () => {
    const messageContext = {
      messages: { success: [{ msg: "Test message" }] },
      clearMessages: jest.fn(),
      setSuccessMessages: jest.fn(),
      setInfoMessages: jest.fn(),
      setErrorMessages: jest.fn()
    };
    let sessionContext = {
      token: null,
      user: {},
      saveSession: () => {},
      clearSession: () => {},
      updateUserProfile: () => {}
    };

    const wrapper = render(
      <MemoryRouter initialEntries={["/mydashboard/initiate"]}>
        <MyDashboard
          messageContext={messageContext}
          location={{ pathname: "/mydashboard" }}
          sessionContext={sessionContext}
        />
      </MemoryRouter>
    );

    expect(wrapper.find(".qa-link")).toHaveLength(5);
  });
});
