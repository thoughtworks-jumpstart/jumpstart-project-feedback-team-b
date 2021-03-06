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
  const text = `Hi ${giverName}, ${receiverName} has requested you to provide some feedback via myFeedback \n
  Click on the link below to see your feedback. \n
  http://${getHostAndPort(
    req
  )}/mydashboard/pendingrequest/feedback/${savedRequestedFeedback_id} \n\n`;
  try {
    await mailer.sendText(fromAddress, toAddress, subject, text);
  } catch (error) {
    return res.status(202).send({
      feedbackId: savedRequestedFeedback_id,
      msg: `The email to ${giver.name} (${
        giver.email
      }) to request for feedback was not sent. You might want to inform ${
        giver.name
      } to login to myFeedback to view the request`
    });
  }

  return res.status(200).send({
    feedbackId: savedRequestedFeedback_id,
    msg: `Your request for feedback from ${giver.name} (${
      giver.email
    }) was sent successfully`
  });
}
async function retrieveFeedback(req, res) {
  // ?role=receiver&status=receiver
  if (req.params.id) {
    return retrieveFeedbackByID(req, res);
  } else {
    return retrieveFeedbackByEmail(req, res);
  }
}

async function retrieveFeedbackByEmail(req, res) {
  try {
    const email = req.jwt.email;
    const role = req.query.role;
    let status = req.query.status;
    status = [`${status.toUpperCase()}_UNREAD`, `${status.toUpperCase()}_READ`];
    const retrievedFeedback = await Feedback.find({
      [role]: email,
      status: { $in: status }
    });

    let userEmails;
    if (role === "receiver") {
      userEmails = Array.from(
        new Set(retrievedFeedback.map(feedback => feedback.giver))
      );
    } else {
      userEmails = Array.from(
        new Set(retrievedFeedback.map(feedback => feedback.receiver))
      );
    }
    let userNames = await User.retrieveUsersByEmails(userEmails);
    const feedbackWithNames = retrievedFeedback.map(feedback => {
      let data = feedback.toObject();
      if (role === "receiver") {
        data["giver_name"] = userNames[feedback.giver];
      } else {
        data["receiver_name"] = userNames[feedback.receiver];
      }
      return data;
    });

    return res.status(200).send({
      receiver: feedbackWithNames
    });
  } catch (error) {
    return res.status(400).send({
      msg: "There was an error processing your request"
    });
  }
}

async function retrieveFeedbackByID(req, res) {
  try {
    const feedbackId = req.params.id;
    const email = req.jwt.email;
    let feedback = await Feedback.findById(feedbackId);
    if (feedback.giver != email && feedback.receiver != email) {
      return res.status(400).send({
        msg: "You are not authorized to see this feedback"
      });
    }

    if (feedback.status === "GIVER_UNREAD") {
      feedback.status = "GIVER_READ";
      await feedback.save();
    }
    if (feedback.status === "RECEIVER_UNREAD") {
      feedback.status = "RECEIVER_READ";
      await feedback.save();
    }

    let userEmails = [feedback.giver];
    let userNames = await User.retrieveUsersByEmails(userEmails);
    const feedbackWithName = feedback.toObject();
    feedbackWithName["giver_name"] = userNames[feedback.giver];

    return res.status(200).send({
      feedback: feedbackWithName
    });
  } catch (error) {
    return res.status(400).send({
      msg: "The feedback could not be found in the system."
    });
  }
}

async function updateFeedback(req, res) {
  const feedbackId = req.params.id;
  const receiver = await User.findOne({ email: req.body.receiver });

  const userId = req.jwt.userid;
  const user = await User.findById(userId);

  let updateFeedback = {
    giver: user.email,
    receiver: receiver.email,
    status: "RECEIVER_UNREAD",
    feedbackItems: req.body.feedbackItems
  };

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
