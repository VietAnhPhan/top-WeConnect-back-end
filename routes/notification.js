const { Router } = require("express");
const { param, validationResult } = require("express-validator");
const passport = require("passport");

const notificationController = require("../controllers/notificationController");

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

const sendValidationResults = (req, res, next) => {
  const validations = validationResult(req);
  if (!validations.isEmpty()) {
    res.status(400).json({
      errors: validations.array(),
    });
  }
  next();
};

router.post("/", notificationController.createNotification);

router.get("/", notificationController.getNotifications);

module.exports = router;
