import { shallow, render, mount } from "enzyme";
import React from "react";
import { RequestFeedbackForm } from "./RequestFeedbackForm";
import { Cookies } from "react-cookie";
import { MemoryRouter } from "react-router-dom";
import fetchMock from "fetch-mock";

describe("RequestFeedbackForm test", () => {
  let messageContext = {
    messages: {},
    clearMessages: jest.fn(),
    setSuccessMessages: jest.fn(),
    setErrorMessages: jest.fn(),
    setInfoMessages: jest.fn()
  };
  let sessionContext = {
    token: null,
    user: {},
    saveSession: jest.fn(),
    clearSession: jest.fn(),
    updateUserProfile: jest.fn()
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

    expect(
      wrapper.find("[data-cy=RequestFeedbackForm_emailInput]")
    ).toHaveLength(1);
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

  it("should set the success context message if the request is submitted successfully", async () => {
    const wrapper = mount(
      <MemoryRouter>
        <RequestFeedbackForm
          history={{}}
          cookies={new Cookies()}
          messageContext={messageContext}
          sessionContext={sessionContext}
        />
      </MemoryRouter>
    );

    fetchMock.post("/api/feedback/request", {
      status: 200,
      body: `{ "msg": "Woo hoo!" }`
    });

    const submitRequest = wrapper.find("RequestFeedbackForm").instance()
      .submitRequest;
    // wrapper.instance().submitRequest({ email: "abc@def.com" });

    console.log(submitRequest);
    await submitRequest({ email: "abc@def.com" });

    // const submitButton = wrapper.find(".qa-request-submit-btn");
    // submitButton.simulate("click", { preventDefault() {} });

    // //  wrapper.instance().submitRequest("abc@def.com");
    // // console.log(wrapper.find("RequestFeedbackForm").debug());
    console.log(
      wrapper.find("RequestFeedbackForm").props().messageContext
        .setSuccessMessages.mock.calls[0]
    );
    expect(
      wrapper.find("RequestFeedbackForm").props().messageContext
        .setSuccessMessages
    ).toHaveBeenCalled();

    fetchMock.restore();
  });
});
