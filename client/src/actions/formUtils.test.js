import { Share } from "./formUtils";
const fetchMock = require("fetch-mock");

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

    let response = await fetchMock.post("/api/feedback/initiate", {
      status: 200,
      body: {
        msg: "Your feedback to was sent successfully"
      }
    });
    await Share({
      email,
      feedbackItem1,
      feedbackItem2,
      feedbackItem3,
      sessionContext,
      messageContext,
      history
    });
    //   .then(() => console.log("hello"))
    //   .catch(erro => console.log("something wrong"));

    expect(clearMessages1).toHaveBeenCalledTimes(1);
    expect(setSuccessMessages11).toHaveBeenCalledTimes(1);
  });
});
