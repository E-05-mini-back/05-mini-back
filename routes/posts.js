const express = require("express");
const router = express.Router();
const { Posts, Users } = require("../models");
const authMiddlewares = require("../middlewares/auth_middlewares");

// 게시물 조회
router.get("/", async (req, res) => {
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
          likes: e.likes,
        };
      }),
    });
    return;
  } catch (err) {
    res.status(400).json({
      ok: false,
      errorMessage: "게시물 조회를 실패했습니다.",
    });
    return;
  }
});

// 게시물 생성
router.post("/", authMiddlewares, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { title, images, category, content } = req.body;

    if (title === "" || images === "" || category === "" || content === "") {
      res.status(400).json({
        ok: false,
        errorMessage: "제목, 이미지, 카테고리, 내용을 입력해주세요.",
      });
      return;
    }

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
      request: { title, images, category, content },
    });
    return;
  } catch (err) {
    res.status(400).json({
      ok: false,
      errorMessage: "게시물 생성에 실패했습니다.",
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

    if (data === null) {
      res.status(400).json({
        ok: false,
        errorMessage: "해당 게시물을 찾을 수 없습니다.",
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
          likes: data.likes,
        },
      });
      return;
    }
  } catch (err) {
    res.status(400).json({
      ok: false,
      errorMessage: "상세 게시물 조회를 실패했습니다.",
    });
    return;
  }
});

// 게시물 수정
router.put("/:postId", authMiddlewares, async (req, res) => {
  try {
    const { userId } = res.locals.user;

    const { postId } = req.params;
    const { title, images, content, category } = req.body;

    if (title === "" || images === "" || category === "" || content === "") {
      res.status(400).json({
        ok: false,
        errorMessage: "제목, 이미지, 카테고리, 내용을 입력해주세요.",
      });
      return;
    }

    const data = await Posts.findOne({
      where: { postId },
    });

    if (data === null) {
      res.status(400).json({
        ok: false,
        errorMessage: "해당 게시물을 찾을 수 없습니다.",
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
          message: "게시물을 수정했습니다.",
          request: { postId, title, images, content, category },
        });
        return;
      } else {
        res.status(400).json({
          ok: false,
          errorMessage: "작성자가 일치 하지 않습니다.",
        });
        return;
      }
    }
  } catch (err) {
    res.status(400).json({
      ok: false,
      errorMessage: "게시물 수정을 실패했습니다.",
    });
    return;
  }
});

// 게시물 삭제
router.delete("/:postId", authMiddlewares, async (req, res) => {
  try {
    const { userId } = res.locals.user;

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
          message: "게시물을 삭제했습니다.",
        });
        return;
      } else {
        res.status(400).json({
          ok: false,
          errorMessage: "작성자가 일치 하지 않습니다.",
        });
        return;
      }
    }
  } catch (err) {
    res.status(400).json({
      ok: false,
      errorMessage: "게시물 삭제를 실패했습니다.",
    });
    return;
  }
});

// 게시물 카테고리별 조회
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const datas = await Posts.findAll({
      where: { category },
      include: {
        model: Users,
        attributes: ["loginId"],
      },
    });

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
      errorMessage: "카테고리별 게시물 조회를 실패했습니다.",
    });
    return;
  }
});

module.exports = router;
