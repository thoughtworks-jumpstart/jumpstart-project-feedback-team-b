import { render } from "enzyme";
import React from "react";
import { RequestFeedbackForm } from "./RequestFeedbackForm";
import { Cookies } from "react-cookie";
import { MemoryRouter } from "react-router-dom";

describe("RequestFeedbackForm test", () => {
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
  it("should have the email text box and the send button", () => {
    const wrapper = render(
      <MemoryRouter>
        <RequestFeedbackForm
          history={{}}
          cookies={new Cookies()}
          messageContext={messageContext}
          sessionContext={sessionContext}
        />
      </MemoryRouter>
    );

    expect(wrapper.find("[data-cy=RequestFeedbackForm_emailInput]")).toHaveLength(1);
    expect(wrapper.find("div.init-save-button .btn")).toHaveLength(1);
  });

  it("should allow us to enter an email address", () => {
    const wrapper = render(
      <MemoryRouter>
        <RequestFeedbackForm
          history={{}}
          cookies={new Cookies()}
          messageContext={messageContext}
          sessionContext={sessionContext}
        />
      </MemoryRouter>
    );
    const emailInput = wrapper.find("[data-cy=RequestFeedbackForm_emailInput]");
    emailInput.val("a@a.com");
    expect(emailInput.val()).toEqual("a@a.com");
  });
});
