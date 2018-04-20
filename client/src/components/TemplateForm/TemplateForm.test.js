import { shallow } from "enzyme";
import React from "react";
import { TemplateForm } from "../TemplateForm/TemplateForm";
import { Cookies } from "react-cookie";
import * as formUtils from "../../actions/formUtils";

describe("TemplateForm functional tests", () => {
  it("should allow share function when shareHandler is called", () => {
    window.confirm = jest.fn(() => true);
    formUtils.share = jest.fn();
    const props = {
      messageContext: {
        messages: {},
        clearMessages: () => {},
        setSuccessMessages: () => {},
        setErrorMessages: () => {},
        setInfoMessages: () => {}
      },
      sessionContext: {
        token: null,
        user: {},
        saveSession: () => {},
        clearSession: () => {},
        updateUserProfile: () => {}
      },
      history: {},
      cookies: new Cookies()
    };
    const wrapper = shallow(<TemplateForm {...props} />);
    const event = { preventDefault: () => {} };

    wrapper
      .find(".btn")
      .props()
      .onClick(event);
    expect(formUtils.share).toHaveBeenCalledTimes(1);
  });
});
