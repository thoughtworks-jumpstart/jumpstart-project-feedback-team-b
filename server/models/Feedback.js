const mongoose = require("mongoose");

const FEEDBACK_STATUS = [
  "GIVER_UNREAD", // Receiver initiated feedback - Giver has not read the request
  "GIVER_READ", // Receiver initiated feedback - Giver has read the request
  "DRAFT", // Giver has saved a draft of the feedback (Receiver/Giver initiated feedback)
  "RECEIVER_UNREAD", // Receiver has received feedback, but has not read it
  "RECEIVER_READ" // Receiver has received and read feedback.
];

const FeedbackSchema = new mongoose.Schema(
  {
    receiver: {
      type: String,
      lowercase: true,
      required: [true, "cannot be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    giver: {
      type: String,
      lowercase: true,
      required: [true, "cannot be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    status: {
      type: String,
      enum: FEEDBACK_STATUS,
      default: "GIVER_UNREAD"
    },
    feedbackItems: [String],
    feedbackTemplate: {
      type: String,
      default: "0"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
