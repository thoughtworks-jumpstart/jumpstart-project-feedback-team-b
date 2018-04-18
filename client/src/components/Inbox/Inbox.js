import React from "react";
import { Route } from "react-router-dom";
import Feedback from "./Feedback";

const Inbox = () => (
  <div>
    <Route path="/mydashboard/inbox/feedback/:id" exact component={Feedback} />
  </div>
);

export default Inbox;
