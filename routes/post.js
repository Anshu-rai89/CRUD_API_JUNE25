const express = require('express');
const router = express.Router();

const {
  getPosts,
  createPosts,
  updatePost,
  deletePost,
} = require("../controllers/index");
const {verifyToken} = require('../middleware');
const {header,query,param,body} = require('express-validator');

router.get(
  "/",
  header("metadata").notEmpty().withMessage("metadata  is missing."),
  query("pageNo").notEmpty().withMessage("pageNo  is missing."),
  getPosts
);
router.post("/",createPosts);
router.delete("/:postId",
  param('postId').isMongoId());
router.put(
  "/:postId",
  param("postId").isMongoId(),
  body("content").notEmpty(),
  body("imageUrl").notEmpty(),
  updatePost
);

module.exports = router;
