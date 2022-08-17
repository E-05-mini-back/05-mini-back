const express = require("express");
const router = express.Router();
const { Likes, Posts, Users } = require("../models");
const authMiddlewares = require("../middlewares/auth_middlewares");

//해당 게시글에 좋아요 표시

router.post("/:postId", authMiddlewares, async (req, res) => {
  try {
    const { postId } = req.params;
    const { user } = res.locals;
    const userId = user.userId;

    const detailpost = await Posts.findOne({ where: { postId } });

    if (!detailpost) {
      return res.status(400).json({
        ok: false,
        errorMessage: "게시글이 존재하지않습니다!",
      });
    } else {
      const likesaved = detailpost.likes;
      const likedpost = await Likes.findOne({ where: { postId, userId } });

      if (!likedpost) {
        await Posts.update({ likes: likesaved + 1 }, { where: { postId } });
        await Likes.create({ userId, postId });
        return res
          .status(200)
          .json({ ok: true, message: "게시글에 좋아요 를 눌렀습니다!" });
      } else {
        await Posts.update({ likes: likesaved - 1 }, { where: { postId } });
        await Likes.destroy({ where: { userId: userId, postId: postId } });
        return res
          .status(200)
          .json({ ok: true, message: "게시글의 좋아요 를 취소하였습니다!" });
      }
    }
  } catch (err) {
    return res.status(400).json({
      ok: false,
      errorMessage: "좋아요 기능에 문제가 발생했습니다",
    });
  }
});

// 좋아요 게시글 조회(수정 필요)

// router.get("/", authMiddlewares, async (req, res) => {
//     const { user } = res.locals;
//     const userId = user.userId;

//     const likedposts = await Likes.findAll({ order: [['updatedAt', 'DESC']], where: { userId } });

//     if (likedposts.length) {
//         const likedpostId = likedposts.map((obj) => {
//             const temp = {postId : obj.postId,
//                         userId: obj.userId,

//             };

//             return temp;
//         });
//         // res.json(likedpostId);
//         // const selectPost = await Posts.findAll({ order: [['likes', 'DESC']], where: { postid: likedpostId } });

//         res.json({
//             likedpostId,
//         });
//     }
//     else {
//         return res.status(400).json({ success: false, errorMessage: "좋아요를 표시한 글이 없습니다." });
//     }
// });

router.get("/", authMiddleware, async (req, res) =>{
  const userId = user.userId;
  const likeid  = await Like.findAll({where: { userId }})
  const postId = await likeid.map((a)=>{ return a.postId })
  const likepost = await Post.findAll({where :{ id: postId}})

  res.json({
      data : likepost.map((posts) =>({
      postId : posts.id,
      title : posts.title,
      nickname : posts.nickname,
      content : posts.content,
      Like : posts.Like,
      createdAt : posts.createdAt,
      updatedAt : posts.updatedAt
      })).sort((a, b) => b.Like - a.Like)
  })

 
})

module.exports = router;
