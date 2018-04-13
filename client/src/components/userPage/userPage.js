import React from "react";
import { NavLink } from "react-router-dom";
import "./userPage.css";
const userPage = () => {
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
          <NavLink to="#">initiate Feedback </NavLink>
        </li>
        <li>
          <NavLink to="#">Pending feedback</NavLink>
        </li>
      </div>
      <div className="info-body-content">
        <h1>default content</h1>
      </div>
    </div>
  );
};

export default userPage;
