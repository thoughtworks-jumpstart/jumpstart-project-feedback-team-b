import { shallow } from "enzyme";
import ClientRouter from "./ClientRouter";
import React from "react";
import { Route, Switch } from "react-router-dom";

describe("ClientRouter test", () => {
  test("ClientRouter structure testing", () => {
    const wrapper = shallow(<ClientRouter />);
    expect(wrapper.find("div")).toHaveLength(1);
    //expect(wrapper.find(PrivateRoute)).toHaveLength(1);
    expect(wrapper.find(Route)).toHaveLength(7);
    expect(wrapper.find(Switch)).toHaveLength(1);
  });
});
