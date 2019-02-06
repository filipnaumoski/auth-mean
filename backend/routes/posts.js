const express = require("express");

const PostController = require("../controllers/posts");
const checkAuth = require('../middleware/check-auth');
const exportFile = require('../middleware/file');

const router = express.Router();

router.post("", checkAuth, exportFile, PostController.cretePost);

router.put("/:id", checkAuth, exportFile, PostController.updatePost);

router.get("", PostController.getPosts);

router.get("/:id", checkAuth, PostController.getPost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
