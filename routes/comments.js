const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth_middlewares");
const { Comments, Users, Posts } = require("../models")

// router.get("/", (req, res) => {
//     ok : true,
//     res.send("welcome to comment")
// })

//댓글 작성
router.post("/:postId", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user
    const { comment } = req.body
    const { postId } = req.params
    if( await Posts.findOne({where: {postId : postId}}) == null ){
        res.status(400).json({
            ok: false,
            errorMessage: "해당 게시물을 찾을 수 없습니다.’."
        })
    }else if (!comment) {
        res.status(400).json({
            ok: false,
            errorMessage: "댓글 내용을 입력해주세요."
        })
    } else {
        await Comments.create({ comment, postId, userId });
        res.status(201).json({
            ok: true,
            message: "댓글을 생성하였습니다."
        })
    }
})

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
      comment: Comment.comment,
      loginId: Comment.loginId,
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
  console.log(Comment);

  if (!comment) {
    res.status(400).json({
      ok: false,
      errorMessage: "댓글 내용을 입력해주세요.",
    });
  } else if (Comment == null) {
    res.status(400).json({
      ok: false,
      errorMessage: "존재하지 않는 댓글입니다.",
    });
  } else if (userId !== Comment.userId) {
    res.status(400).json({
      ok: false,
      errorMessage: "본인 댓글만 수정 가능합니다.",
    });
  } else {
    Comment.update({ comment: comment });
    res.status(201).json({
      ok: true,
      message: "댓글이 수정 되었습니다.",
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
      errorMessage: "존재하지 않는 댓글입니다.",
    });
  } else if (userId !== Comment.userId) {
    res.status(400).json({
      ok: false,
      errorMessage: "본인 댓글만 삭제 가능합니다.",
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
