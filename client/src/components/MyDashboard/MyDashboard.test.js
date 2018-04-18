import { shallow } from "enzyme";
import React from "react";
import { MyDashboard } from "./MyDashboard";
import { NavLink, Switch, Route } from "react-router-dom";

describe("mydashboard structure Testing", () => {
  it("should find all structure element", () => {
    const messageContext = {
      messages: { success: [{ msg: "Test message" }] },
      clearMessages: jest.fn(),
      setSuccessMessages: jest.fn(),
      setInfoMessages: jest.fn(),
      setErrorMessages: jest.fn()
    };

    const wrapper = shallow(<MyDashboard messageContext={messageContext} />);
    expect(wrapper.find("div")).toHaveLength(2);
    expect(wrapper.find("li")).toHaveLength(5);
    expect(wrapper.find(NavLink)).toHaveLength(5);
    expect(wrapper.find(Switch)).toHaveLength(1);
    expect(wrapper.find(Route)).toHaveLength(3);
  });
});
