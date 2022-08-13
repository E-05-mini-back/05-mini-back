const express = require("express");
const Router = require("./routes/index");

require("dotenv").config();
const port = process.env.Port;

const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api", Router);
app.get("/", (req, res) => {
  res.status(200).json({ massage: "연동 잘 됨." });
});

module.exports = app;

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
