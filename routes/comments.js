const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth_middlewares");
const { Comments, Users, Posts } = require("../models");

// router.get("/", (req, res) => {
//     ok : true,
//     res.send("welcome to comment")
// })

//댓글 작성
router.post("/:postId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { comment } = req.body;
  const { postId } = req.params;
  if ((await Posts.findOne({ where: { postId: postId } })) == null) {
    res.status(400).json({
      ok: false,
      errorMessage: "해당 게시물을 찾을 수 없습니다.’.",
    });
  } else if (!comment) {
    res.status(400).json({
      ok: false,
      errorMessage: "댓글 내용을 입력해주세요.",
    });
  } else {
    const commentId = await Comments.create({ comment, postId, userId });
    // 임시
    const newComment = await Comments.findOne({
      where: { commentId: commentId.commentId },
      include: {
        model: Users,
        attributes: ["loginId"],
      },
    });
    res.status(201).json({
      ok: true,
      message: "댓글을 생성하였습니다.",
      request: {
        postId,
        comment,
        loginId: newComment.User.loginId,
        date: newComment.createdAt,
      },
    });
  }
});

//댓글 조회
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  if ((await Posts.findOne({ where: { postId: postId } })) == null) {
    res.status(400).json({
      ok: false,
      errorMessage: "해당 게시물을 찾을 수 없습니다.’.",
    });
  }
  const Comment = await Comments.findAll({
    where: { postId: postId },
    include: {
      model: Users,
      attributes: ["loginId"],
    },
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    ok: true,
    result: Comment.map((Comment) => ({
      commentId: Comment.commentId,
      postId: Comment.postId,
      comment: Comment.comment,
      loginId: Comment.User.loginId,
      date: Comment.createdAt,
    })),
  });
});

//댓글 수정
router.put("/:commentId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { commentId } = req.params;
  const { comment } = req.body;
  const Comment = await Comments.findOne({ where: { commentId: commentId } });
  if (!comment) {
    res.status(400).json({
      ok: false,
      errorMessage: "댓글 내용을 입력해주세요.",
    });
  } else if (Comment == null) {
    res.status(400).json({
      ok: false,
      errorMessage: "해당 댓글을 찾을 수 없습니다.",
    });
  } else if (userId !== Comment.userId) {
    res.status(400).json({
      ok: false,
      errorMessage: "작성자가 일치 하지 않습니다.",
    });
  } else {
    Comment.update({ comment: comment });
    res.status(201).json({
      ok: true,
      message: "댓글을 수정했습니다.",
      request: { commentId, comment },
    });
  }
});

//댓글 삭제
router.delete("/:commentId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { commentId } = req.params;
  const Comment = await Comments.findOne({ where: { commentId: commentId } });
  if (Comment == null) {
    res.status(400).json({
      ok: false,
      errorMessage: "해당 댓글을 찾을 수 없습니다.",
    });
  } else if (userId !== Comment.userId) {
    res.status(400).json({
      ok: false,
      errorMessage: "작성자가 일치 하지 않습니다.",
    });
  } else {
    await Comment.destroy();
    res.status(201).json({
      ok: true,
      message: "댓글을 삭제하였습니다.",
    });
  }
});

module.exports = router;
