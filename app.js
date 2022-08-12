const express = require("express");
// const postsRouter = require("./routes/posts");
// const commentsRouter = require("./routes/comments");
// const userRouter = require("./routes/users");
// const loginRouter = require("./routes/login");
// const likeRouter = require("./routes/like");
const Router = require("./routes/index");

require("dotenv").config();
const port = process.env.Port;

const app = express();

app.use(express.json());

app.use("/api", Router);
// app.use("/", [likeRouter]);
// app.use("/posts", [postsRouter]); //게시글
// app.use("/comments", [commentsRouter]); //댓글
// app.use("/signup", [userRouter]); //회원가입
// app.use("/login", [loginRouter]); //로그인

module.exports = app;

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
