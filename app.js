const express = require("express");
const Router = require("./routes/index");

const { swaggerUi, specs } = require("./swagger");

require("dotenv").config();
const port = process.env.Port;

const app = express();
const cors = require("cors");

// app.use(cors());
app.use(
  cors({
    origin: true, // 출처 허용 옵션
    withCredentials: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  })
);

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api", Router);
app.get("/", (req, res) => {
  res.status(200).json({ massage: "연동 잘 됨." });
});

module.exports = app;

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
