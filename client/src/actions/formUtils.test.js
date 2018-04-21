import { share, getTemplateLabels } from "./formUtils";
import fetchMock from "fetch-mock";

describe("Initiate feedback with Share function testing", () => {
  it("should be called ", async () => {
    const clearMessages1 = jest.fn();
    const setSuccessMessages11 = jest.fn();
    let email = "test@test.test";
    let feedbackItem1 = "hello";
    let feedbackItem2 = "hello";
    let feedbackItem3 = "hello";
    let messageContext = {
      clearMessages: clearMessages1,
      setSuccessMessages: setSuccessMessages11
    };
    let sessionContext = {
      token: "random token"
    };
    function replace() {}
    let history = { replace };

    await fetchMock.post("/api/feedback/initiate", {
      status: 200,
      body: {
        msg: `Your feedback was sent successfully to ${email}`
      }
    });
    await share({
      email,
      feedbackItem1,
      feedbackItem2,
      feedbackItem3,
      sessionContext,
      messageContext,
      history
    });
    expect(clearMessages1).toHaveBeenCalledTimes(1);
    expect(setSuccessMessages11).toHaveBeenCalledTimes(1);
  });
});

describe("getTemplateLables", () => {
  it("getTempalteLabels should return an array.length of 3", () => {
    expect(getTemplateLabels()).toHaveLength(3);
  });
});
