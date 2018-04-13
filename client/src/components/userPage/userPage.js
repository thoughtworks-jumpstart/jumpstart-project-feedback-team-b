import React from "react";
import { NavLink, Switch, Route } from "react-router-dom";
import "./UserPage.css";
import TemplateForm from "../TemplateForm/TemplateForm";
const UserPage = () => {
  return (
    <div className="info-body">
      <div className="info-body-sidebar">
        <li>
          <NavLink to="#">incoming request </NavLink>
        </li>
        <li>
          <NavLink to="#">Pending request </NavLink>
        </li>
        <li>
          <NavLink to="/UserPage/home">initiate Feedback </NavLink>
        </li>
        <li>
          <NavLink to="#">Pending feedback</NavLink>
        </li>
      </div>
      <div className="info-body-content">
        <Switch>
          <Route path="/UserPage/home" exact component={TemplateForm} />
        </Switch>
      </div>
    </div>
  );
};

export default UserPage;
