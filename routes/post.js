const { Router } = require("express");
const { param, validationResult } = require("express-validator");
const passport = require("passport");

const postController = require("../controllers/postController");

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

router.use(
  "/:id",
  param("id").isNumeric().withMessage("Post Id should be a number"),
  sendValidationResults
);

router.get("/:id", postController.getPost);

router.get("{search}", postController.searchPosts);

router.get("{trending}", postController.getTrendingPosts);

router.post("/", postController.createPost);

router.patch("/:id", postController.updatePost);

router.delete("/:id", postController.deletePost);

router.get("/", postController.getPosts);

module.exports = router;
