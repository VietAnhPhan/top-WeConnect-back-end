const { Router } = require("express");
const { param, validationResult } = require("express-validator");
const passport = require("passport");

const userController = require("../controllers/userController");
const multer = require("multer");

const router = Router();

const sendValidationResults = (req, res, next) => {
  const validations = validationResult(req);
  if (!validations.isEmpty()) {
    res.status(400).json({
      errors: validations.array(),
    });
  }
  next();
};

router.use(
  "/:id",
  param("id").isNumeric().withMessage("User Id should be a number"),
  sendValidationResults
);

// Unauthentication

router.get("{search}", userController.searchUsers);
router.get("{followers=highest}", userController.getUsersByHighestFollowers);
router.use(passport.authenticate(["jwt"], { session: false }));

// Authentication
router.get("/:id", userController.getUser);
router.get("{username}", userController.getUserByUsername);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("{conversation_id&auth_id}", userController.getChatUser);
router.get("/", userController.getUsers);

module.exports = router;
