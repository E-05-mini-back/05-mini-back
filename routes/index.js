const express = require("express");
const router = express.Router();

const postsRouter = require("./posts");
const commentsRouter = require("./comments");
const usersRouter = require("./users");
const likesRouter = require("./likes");

router.use("/", usersRouter);
router.use("/", likesRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);

module.exports = router;
