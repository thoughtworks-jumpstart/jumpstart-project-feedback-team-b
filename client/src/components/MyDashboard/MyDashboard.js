import React from "react";
import { NavLink, Switch, Route } from "react-router-dom";
import "./MyDashboard.css";
import TemplateForm from "../TemplateForm/TemplateForm";

const MyDashboard = () => {
  return (
    <div className="info-body">
      <ul className="info-body-sidebar">
        <li>
          <NavLink to="#">Incoming request </NavLink>
        </li>
        <li>
          <NavLink to="#">Pending request </NavLink>
        </li>
        <li>
          <NavLink to="/mydashboard/initiate">Initiate Feedback </NavLink>
        </li>
        <li>
          <NavLink to="#">Pending feedback</NavLink>
        </li>
      </ul>
      <div className="info-body-content">
        <Switch>
          <Route path="/mydashboard/initiate" exact component={TemplateForm} />
        </Switch>
      </div>
    </div>
  );
};

export default MyDashboard;
