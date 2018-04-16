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
    await feedback.save();
  } catch (error) {
    return res.status(400).send({
      msg: "There was an error processing your request"
    });
  }
  // should call the mailgun api here to trigger mail send
  const fromAddress = user.email;
  const toAddress = receiver.email;
  const giverName = user.name;
  const receiverName = receiver.name;
  const subject = "You have a feedback from " + giverName;
  const text = "Hi " + giverName + "has given you some feedback via myFeedback";
  mailer.sendText(fromAddress, toAddress, subject, text);

  return res.status(200).send({
    msg: `Your feedback to ${receiverName} (${toAddress}) was sent successfully`
  });
}

module.exports = {
  initiateFeedback
};
