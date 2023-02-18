const Post = require('../Modal/Post');
const _ = require('lodash');
const {validationResult} = require('express-validator');
const redis = require('../config/redis');
const client = require('../config/redis');

module.exports.getPosts = async (req, res) => {
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

module.exports.createPosts = async (req, res) => {
  const {content , imageUrl, userName} = req.body || {};

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


module.exports.updatePost = async (req, res) => {
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

module.exports.deletePost = async (req, res) => {
  const postId = req.params.postId;
  
  await Post.findByIdAndRemove(postId);
    await client.del("user-posts");

  return res.status(200).json({
    msg: "Post Deleted successfully",
    data: postId,
  });
};