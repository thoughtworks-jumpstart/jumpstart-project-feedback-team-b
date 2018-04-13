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
    // should call the mailgun api here to trigger mail send
    const toAddress = feedback.receiver;
    const fromAddress = feedback.giver;
    const subject = "Feedback Request from " + user.name;
    const text =
      "Hello,\n\n" + " You have a new feedback request from" + user.name + "\n";
    mailer.sendText(fromAddress, toAddress, subject, text);
  } catch (error) {
    return res.status(400).send({
      msg: "There was an error processing your request"
    });
  }
  // should call the mailgun api here to trigger mail send
  const toAddress = user.email;
  const fromAddress = systemEmailAddress;
  const subject = "Your Password for " + applicationName + " has been changed";
  const text =
    "Hello,\n\n" +
    "This is a confirmation that the password for your account " +
    user.email +
    " has just been changed.\n";
  mailer.sendText(fromAddress, toAddress, subject, text);

  res.send({ msg: "Your password has been changed successfully." });

  return res.status(200).send({
    msg: `Your feedback to ${req.body.receiver} was sent successfully`
  });
}

module.exports = {
  initiateFeedback
};
