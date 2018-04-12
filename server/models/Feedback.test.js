const test_mongodb = require("../test_helper/in_memory_mongodb_setup");
const ValidationError = require("mongoose").ValidationError;

beforeAll(test_mongodb.setup);
afterAll(test_mongodb.teardown);

const Feedback = require("./Feedback");

describe("Feedback model", () => {
  const giver = "giver@giver.com";
  const receiver = "receiver@receiver.com";
  const feedbackItems = [
    "What I did Well",
    "What I could do Better",
    "Suggestions for Improvement"
  ];
  const newFeedbackItems = [
    "You did well",
    "Better would be good",
    "Improvements are welcome"
  ];

  let feedback = new Feedback({ giver, receiver, feedbackItems });

  it("can be saved", async () => {
    await expect(feedback.save()).resolves.toBe(feedback);
  });

  it("should have createdAt and updatedAt timestamp after being saved", () => {
    expect(feedback.createdAt).toBeDefined();
    expect(feedback.updatedAt).toBeDefined();
  });

  it("should have the default values written", async () => {
    expect(feedback.status).toEqual("GIVER_UNREAD");
    expect(feedback.feedbackTemplate).toEqual("0");
  });

  it("should enforce required field for receiver", async () => {
    let feedback = new Feedback({ giver });
    await expect(feedback.save()).rejects.toThrowError(ValidationError);
  });

  it("should enforce required field for giver", async () => {
    let feedback = new Feedback({ receiver });
    await expect(feedback.save()).rejects.toThrowError(ValidationError);
  });

  it("can be searched by _id", async () => {
    let searchResult = await Feedback.findById(feedback._id);
    expect(searchResult.giver).toEqual(giver);
    expect(searchResult.receiver).toEqual(receiver);
  });

  it("can be searched by receiver email", async () => {
    let searchResult = await Feedback.findOne({ receiver });
    expect(searchResult.giver).toEqual(giver);
    expect(searchResult.receiver).toEqual(receiver);
  });

  it("can be searched by status", async () => {
    let searchResult = await Feedback.findOne({ status: "GIVER_UNREAD" });
    expect(searchResult.giver).toEqual(giver);
    expect(searchResult.receiver).toEqual(receiver);
  });

  it("feedbackItems can be updated", async () => {
    feedback.feedbackItems = newFeedbackItems;
    await feedback.save();
    let searchResult = await Feedback.findById(feedback._id);
    expect(JSON.stringify(searchResult.feedbackItems)).toEqual(
      JSON.stringify(newFeedbackItems)
    );
  });

  it("status can be updated", async () => {
    const newStatus = "DRAFT";
    feedback.status = newStatus;
    await feedback.save();
    let searchResult = await Feedback.findById(feedback._id);
    expect(searchResult.status).toEqual(newStatus);
  });

  it("can be deleted", async () => {
    await feedback.remove();
    let searchResult = await Feedback.findById(feedback._id);
    expect(searchResult).toBeNull();
  });

  it("should throw a validation error if status is not in enum", async () => {
    feedback.status = "NOT VALID";
    await expect(feedback.save()).rejects.toThrowError(ValidationError);
  });
});

describe("Multiple Feedback", () => {
  let giver1 = "giver1@giver.com";
  let giver2 = "giver2@giver.com";
  let receiver1 = "receiver1@receiver.com";
  let receiver2 = "receiver2@receiver.com";

  it("should allow multiple feedback for receivers", async () => {
    let feedback1 = new Feedback({ giver: giver1, receiver: receiver1 });
    let feedback2 = new Feedback({ giver: giver2, receiver: receiver1 });

    await expect(feedback1.save()).resolves.toBe(feedback1);
    await expect(feedback2.save()).resolves.toBe(feedback2);
  });

  it("should allow multiple feedback for givers", async () => {
    let feedback1 = new Feedback({ giver: giver1, receiver: receiver1 });
    let feedback2 = new Feedback({ giver: giver1, receiver: receiver2 });

    await expect(feedback1.save()).resolves.toBe(feedback1);
    await expect(feedback2.save()).resolves.toBe(feedback2);
  });

  it("should allow multiple feedback for giver-receiver pairs", async () => {
    let feedback1 = new Feedback({ giver: giver1, receiver: receiver1 });
    let feedback2 = new Feedback({ giver: giver1, receiver: receiver1 });

    await expect(feedback1.save()).resolves.toBe(feedback1);
    await expect(feedback2.save()).resolves.toBe(feedback2);
  });
});
