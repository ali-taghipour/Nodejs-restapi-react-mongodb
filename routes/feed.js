const express = require("express");
const feedController = require("../controllers/feed");
const {body} = require("express-validator");
const isAuth = require("../middleware/is_auth");

const router = express.Router();

router.get("/posts",isAuth,feedController.getPosts);

router.post("/post",isAuth,[
    body("title").isLength({min:5}).trim(),
    body("content").isLength({min:5}).trim()
],feedController.createPost);

router.get("/post/:postId",isAuth,feedController.getPost);

router.put("/post/:postId",isAuth,[
    body("title").isLength({min:5}).trim(),
    body("content").isLength({min:5}).trim()
],feedController.updatePost);

router.delete("/post/:postId",isAuth,feedController.deletePost);

module.exports = router;