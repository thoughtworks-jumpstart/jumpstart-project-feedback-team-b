const Feedback = require("../models/Feedback");
const User = require("../models/User");
const mailer = require("../utils/email_service");

async function initiateFeedback(req, res) {
  const receiver = await User.findOne({ email: req.body.receiver });
  if (!receiver) {
    return res.status(400).send({
      msg:
        "The receiver email address you have entered is not found in the system."
    });
  }

  const userId = req.jwt.userid;
  const user = await User.findById(userId);

  let feedback = new Feedback({
    giver: user.email,
    receiver: receiver.email,
    status: "RECEIVER_UNREAD",
    feedbackItems: req.body.feedbackItems
  });

  try {
    const savedFeedback = await feedback.save();
    // should call the mailgun api here to trigger mail send
    const fromAddress = user.email;
    const toAddress = receiver.email;
    const giverName = user.name;
    const receiverName = receiver.name;
    const savedFeedback_id = savedFeedback._id;
    const subject = "You have a feedback from " + giverName;
    const text = `Hi ${giverName} has given you some feedback via myFeedback. \n
       Click on the link below to see your feedback ${savedFeedback_id}`;
    mailer.sendText(fromAddress, toAddress, subject, text);

    return res.status(200).send({
      msg: `Your feedback to ${receiverName} (${toAddress}) was sent successfully`
    });
  } catch (error) {
    return res.status(400).send({
      msg: "There was an error processing your request"
    });
  }
}

async function requestFeedback(req, res) {
  const giver = await User.findOne({ email: req.body.giver });
  if (!giver) {
    return res.status(400).send({
      msg: "The email address you have entered is not found in the system."
    });
  }

  const userId = req.jwt.userid;
  const receiver = await User.findById(userId);

  let feedback = new Feedback({
    giver: giver.email,
    receiver: receiver.email,
    status: "GIVER_UNREAD",
    feedbackItems: ["", "", ""]
  });

  try {
    await feedback.save();
  } catch (error) {
    return res.status(400).send({
      msg: "There was an error processing your request"
    });
  }

  const fromAddress = receiver.email;
  const toAddress = giver.email;
  const giverName = giver.name;
  const receiverName = receiver.name;
  const subject = "You have a request for feedback from " + receiverName;
  const text = `Hi ${giverName}, ${receiverName} has requested you to provide some feedback via myFeedback`;

  try {
    await mailer.sendText(fromAddress, toAddress, subject, text);
  } catch (error) {
    return res.status(200).send({
      msg: `The email to ${giver.name} (${
        giver.email
      }) to request for feedback was not sent. You might want to inform ${
        giver.name
      } to login to myFeedback to view the request`
    });
  }

  return res.status(200).send({
    msg: `Your request for feedback from ${giver.name} (${
      giver.email
    }) was sent successfully`
  });
}

async function retrieveFeedback(req, res) {
  try {
    const feedbackId = req.params.id;
    let feedback = await Feedback.findById(feedbackId);
    return res.status(200).send({
      feedback
    });
  } catch (error) {
    return res.status(500).send({
      msg: "There was an error processing your request"
    });
  }
}

module.exports = {
  initiateFeedback,
  requestFeedback,
  retrieveFeedback
};
