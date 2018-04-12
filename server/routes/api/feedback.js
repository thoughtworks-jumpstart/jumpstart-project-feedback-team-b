const router = require("express").Router();
const handleAsyncError = require("express-async-wrap");
const { initiateFeedback } = require("../../controllers/feedback_controller");

const jwt = require("../../middlewares/jwt_middleware");

router.post(
  "/feedback/initiate",
  jwt.required,
  handleAsyncError(initiateFeedback)
);

module.exports = router;
