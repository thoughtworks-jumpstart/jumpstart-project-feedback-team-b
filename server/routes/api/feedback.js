const router = require("express").Router();
const handleAsyncError = require("express-async-wrap");
const {
  initiateFeedback,
  requestFeedback,
  getFeedback
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

router.get("/feedback/:id", jwt.required, handleAsyncError(getFeedback));

module.exports = router;
