const router = require("express").Router();
const handleAsyncError = require("express-async-wrap");
const {
  initiateFeedback,
  requestFeedback,
  retrieveFeedback,
  updateFeedback
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

router.get("/feedback/:id", jwt.required, handleAsyncError(retrieveFeedback));

router.put(
  "/feedback/request/:id",
  jwt.required,
  handleAsyncError(updateFeedback)
);

module.exports = router;
