const express = require('express');
const router = express.Router();

const {
  getPosts,
  createPosts,
  updatePost,
  deletePost,
} = require("../controllers");
const {verifyToken} = require('../middleware');
const {header,query,param,body} = require('express-validator');

router.get(
  "/",
  header("metadata").notEmpty().withMessage("metadata  is missing."),
  query("pageNo").notEmpty().withMessage("pageNo  is missing."),
  verifyToken,
  getPosts
);
router.post("/", verifyToken,createPosts);
router.delete("/:postId",
  param('postId').isMongoId(),
  verifyToken, deletePost);
router.put(
  "/:postId",
  param("postId").isMongoId(),
  body("content").notEmpty(),
  body("imageUrl").notEmpty(),
  verifyToken,
  updatePost
);

module.exports = router;
