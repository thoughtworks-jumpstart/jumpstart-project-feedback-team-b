import { shallow } from "enzyme";
import React from "react";
import MyDashboard from "./MyDashboard";
import { NavLink, Switch, Route } from "react-router-dom";

describe("mydashboard structure Testing", () => {
  it("should find all structure element", () => {
    const wrapper = shallow(<MyDashboard />);
    expect(wrapper.find("div")).toHaveLength(2);
    expect(wrapper.find("li")).toHaveLength(4);
    expect(wrapper.find(NavLink)).toHaveLength(4);
    expect(wrapper.find(Switch)).toHaveLength(1);
    expect(wrapper.find(Route)).toHaveLength(1);
  });
});
