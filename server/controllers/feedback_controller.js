const Feedback = require("../models/Feedback");
const User = require("../models/User");
const mailer = require("../utils/email_service");
const { isLocal, frontendPort } = require("../config");

function getHostAndPort(req) {
  if (isLocal) {
    return "localhost:" + frontendPort;
  } else {
    return req.headers.host;
  }
}

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

  let savedFeedback_id;
  try {
    const savedFeedback = await feedback.save();
    savedFeedback_id = savedFeedback._id;
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
  const text = `Hi ${giverName} has given you some feedback via myFeedback. \n
       Click on the link below to see your feedback. \n
       http://${getHostAndPort(
         req
       )}/mydashboard/inbox/feedback/${savedFeedback_id}\n\n`;
  try {
    await mailer.sendText(fromAddress, toAddress, subject, text);
  } catch (error) {
    return res.status(202).send({
      msg: `The email to ${receiverName} (${toAddress}) to inform him/her of your feedback was not sent. 
        You might want to inform ${receiverName} to login to myFeedback to view the feedback you have shared with him/her.`
    });
  }
  return res.status(200).send({
    msg: `Your feedback to ${receiverName} (${toAddress}) was sent successfully`
  });
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

  let savedRequestedFeedback_id;
  try {
    const savedRequestedFeedback = await feedback.save();
    savedRequestedFeedback_id = savedRequestedFeedback._id;
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
    return res.status(202).send({
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
    if (!feedback) {
      return res.status(400).send({
        msg: "The feedback could not be found in the system."
      });
    }
    return res.status(200).send({
      feedback
    });
  } catch (error) {
    return res.status(400).send({
      msg: "There was an error processing your request"
    });
  }
}

async function updateFeedback(req, res) {
  const feedbackId = req.params.id;
  const receiver = await User.findOne({ email: req.body.receiver });

  const userId = req.jwt.userid;
  const user = await User.findById(userId);

  let updateFeedback = new Feedback({
    giver: user.email,
    receiver: receiver.email,
    status: "RECEIVER_UNREAD",
    feedbackItems: req.body.feedbackItems
  });

  let savedFeedback_id;
  try {
    const savedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      updateFeedback
    );
    savedFeedback_id = savedFeedback._id;
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
  const text = `Hi ${giverName} has given you some feedback via myFeedback. \n
       Click on the link below to see your feedback. \n
       http://${getHostAndPort(
         req
       )}/mydashboard/inbox/feedback/${savedFeedback_id}\n\n`;
  try {
    await mailer.sendText(fromAddress, toAddress, subject, text);
  } catch (error) {
    return res.status(202).send({
      msg: `The email to ${receiverName} (${toAddress}) to inform him/her of your feedback was not sent. 
        You might want to inform ${receiverName} to login to myFeedback to view the feedback you have shared with him/her.`
    });
  }
  return res.status(200).send({
    msg: `Your feedback to ${receiverName} (${toAddress}) was sent successfully`
  });
}
module.exports = {
  initiateFeedback,
  requestFeedback,
  retrieveFeedback,
  updateFeedback
};
