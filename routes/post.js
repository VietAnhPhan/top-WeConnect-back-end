const { Router } = require("express");
const { param, validationResult } = require("express-validator");
const passport = require("passport");

const postController = require("../controllers/postController");

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

// Unauthenticaion
router.get("/", postController.getPosts);
router.get("{search}", postController.searchPosts);

// Authentication
router.use(passport.authenticate(["jwt"], { session: false }));
router.get("/users/:username", postController.getPostsByUsername);
router.use(
  "/:id",
  param("id").isNumeric().withMessage("Post Id should be a number"),
  sendValidationResults
);
router.get("/:id", postController.getPost);
router.get("{trending}", postController.getTrendingPosts);
router.post("/", postController.createPost);
router.patch("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

module.exports = router;
