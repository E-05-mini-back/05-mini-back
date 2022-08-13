const express = require("express");
const router = express.Router();
const { Posts, Users } = require("../models");
const authMiddlewares = require("../middlewares/auth_middlewares");

// 게시물 조회
router.get("/", async (req, res) => {
  // api명세서 /getpost 경로 수정 필요
  try {
    const datas = await Posts.findAll(
      {
        include: {
          model: Users,
          attributes: ["loginId"],
        },
      }
      // { order: [[("createdAt", "DESC")]] }
    );
    // console.log(datas[0].User);

    res.status(200).json({
      ok: true,
      result: datas.map((e) => {
        return {
          postId: e.postId,
          title: e.title,
          images: e.images,
          category: e.category,
          loginId: e.User.loginId,
        };
      }),
    });
    return;
  } catch (err) {
    res.status(400).json({
      ok: false,
      message: "게시물 조회를 실패했습니다.",
    });
    return;
  }
});

// 게시물 생성
router.post("/", authMiddlewares, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    if (!userId) {
      res.status(400).json({
        ok: false,
        message: "로그인 후 사용 가능합니다.",
      });
      return;
    }

    const { title, images, category, content } = req.body;

    await Posts.create({
      title,
      images,
      category,
      content,
      userId,
    });

    res.status(200).json({
      ok: true,
      message: "생성 성공",
    });
    return;
  } catch (err) {
    res.status(400).json({
      ok: false,
      message: "생성 실패",
    });
    return;
  }
});

// 게시물 상세조회
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const data = await Posts.findOne({
      where: { postId },
      include: {
        model: Users,
        attributes: ["loginId"],
      },
    });
    console.log(data);

    if (data === null) {
      res.status(400).json({
        ok: false,
        message: "해당 게시물을 찾을 수 없습니다.",
      });
      return;
    } else {
      res.status(200).json({
        ok: true,
        result: {
          postId: data.postId,
          title: data.title,
          images: data.images,
          category: data.category,
          loginId: data.loginId,
          content: data.content,
          like: data.likes,
        },
      });
      return;
    }
  } catch (err) {
    res.status(400).json({
      ok: false,
      message: "상세 게시물 조회 실패",
    });
    return;
  }
});

// 게시물 수정
router.put("/:postId", authMiddlewares, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    if (!userId) {
      res.status(400).json({
        ok: false,
        message: "로그인 후 사용 가능합니다.",
      });
      return;
    }

    const { postId } = req.params;
    const { title, images, content, category } = req.body;
    const data = await Posts.findOne({
      where: { postId },
    });

    if (data === null) {
      res.status(400).json({
        ok: false,
        message: "해당 게시물을 찾을 수 없습니다.",
      });
      return;
    } else {
      if (userId === data.userId) {
        await Posts.update(
          {
            title,
            images,
            content,
            category,
          },
          { where: { postId } }
        );
        res.status(200).json({
          ok: true,
          message: "수정 성공",
        });
        return;
      } else {
        res.status(400).json({
          ok: false,
          message: "작성자가 일치 하지 않습니다.",
        });
        return;
      }
    }
  } catch (err) {
    res.status(400).json({
      ok: false,
      message: "수정 실패",
    });
    return;
  }
});

// 게시물 삭제
router.delete("/:postId", authMiddlewares, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    if (!userId) {
      res.status(400).json({
        ok: false,
        message: "로그인 후 사용 가능합니다.",
      });
      return;
    }

    const { postId } = req.params;

    const data = await Posts.findOne({
      where: { postId },
    });

    if (data === null) {
      res.status(400).json({
        ok: false,
        message: "해당 게시물을 찾을 수 없습니다.",
      });
      return;
    } else {
      if (userId === data.userId) {
        await Posts.destroy({ where: { postId } });
        res.status(200).json({
          ok: true,
          message: "삭제 성공",
        });
        return;
      } else {
        res.status(400).json({
          ok: false,
          message: "작성자가 일치 하지 않습니다.",
        });
        return;
      }
    }
  } catch (err) {
    res.status(400).json({
      ok: false,
      message: "삭제 실패",
    });
    return;
  }
});

module.exports = router;
