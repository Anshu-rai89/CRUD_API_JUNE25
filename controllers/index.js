const Post = require('../Modal/Post');
const _ = require('lodash');
const {validationResult} = require('express-validator');
const redis = require('../config/redis');
const client = require('../config/redis');

/**
 * body of get post
 * @param {*} req 
 * @param {*} res 
 * @property pageSize
 * @returns 
 */
const getPosts = async (req, res) => {
    const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({
       msg: "Bad request",
       data: errors,
     });
   }
  const pageNo = req.query.pageNo || 1;
  const pageSize = 3;
  const postToSkip = (pageNo -1)  * pageSize;
   
  const postsFromRedis = await redis.get('user-posts');

  if(!_.isEmpty(postsFromRedis)) {
    console.log("serving from cache")
    return res.status(200).json({
      msg: "Posts fetched successfully",
      data: JSON.parse(postsFromRedis),
    });
  }

    const posts = await Post.find({}).skip(postToSkip).limit(pageSize);

    // add the post in the redis
    await redis.set("user-posts", JSON.stringify(posts), {
      EX: 100, //time to live
      NX: true,
    });
     console.log("serving from DB");
    return res.status(200).json({
        msg:"Posts fetched successfully",
        data:posts
    });
}

/**
 * Creates a new post.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @memberof controllers
 * @async
 *
 * @throws {400} - If any of the required properties (`content`, `imageUrl`, `userName`) are missing in the request body.
 *
 * @returns {Promise<Object>} A promise that resolves with an object containing the message "Post created successfully" and the ID of the newly created post.
 */

const createPosts = async (req, res) => {
  const {content , imageUrl, userName} = req.body;

  if(_.isEmpty(content) || _.isEmpty(imageUrl) || _.isEmpty(userName)) {
    return res.status(400).json({
        msg:"Missing property in post. Please send all required fields.",
        data:[]
    });
  }

  const post = await Post.create({content, imageUrl, userName});
  // delete cache

  await client.del("user-posts");

  return res.status(201).json({
    msg: "Post created successfully",
    data: post.id,
  });
};


/**
 * Updates an existing post.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 *
 * @typedef UpdatePostRequestBody
 * @property {string} [content] - The updated content of the post.
 * @property {string} [imageUrl] - The updated image URL of the post.
 * @property {string} [userName] - The updated username associated with the post.
 *
 * @returns {Promise<void>}
 */
const updatePost = async (req, res) => {
    const postId = req.params.postId;
    const {content , imageUrl, userName} = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        msg: "Bad request",
        data: errors,
      });
    }

    const post = await Post.findByIdAndUpdate(postId, {content, imageUrl, userName});
      await client.del("user-posts");
    return res.status(200).json({
      msg: "Post updated successfully",
      data: post,
    });
}

const deletePost = async (req, res) => {
  const postId = req.params.postId;
  
  await Post.findByIdAndRemove(postId);
    await client.del("user-posts");

  return res.status(200).json({
    msg: "Post Deleted successfully",
    data: postId,
  });
};


module.exports = {
  createPosts,
  deletePost,
  updatePost,
  getPosts,
};