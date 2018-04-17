const router = require("express").Router();
const handleAsyncError = require("express-async-wrap");
const {
  initiateFeedback,
  requestFeedback
} = require("../../controllers/feedback_controller");

const jwt = require("../../middlewares/jwt_middleware");

router.post(
  "/feedback/initiate",
  jwt.required,
  handleAsyncError(initiateFeedback)
);

router.post(
  "/feedback/request",
  jwt.required,
  handleAsyncError(requestFeedback)
);

module.exports = router;
