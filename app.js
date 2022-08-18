const express = require("express");
const Router = require("./routes/index");
const fs = require('fs');
const http=require("http");
const https=require("https");

const { swaggerUi, specs } = require("./swagger");

require("dotenv").config();
const port = process.env.Port;



const app = express();
// const app2 = exrpess();
const cors = require("cors");


 const options = {
  ca: fs.readFileSync('/etc/letsencrypt/live/shshinkitec.shop/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/shshinkitec.shop/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/shshinkitec.shop/cert.pem')
  };


  


// app.use(cors());
app.use(
  cors({
    origin: true, // 출처 허용 옵션
    withCredentials: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  })
);

app.use(express.static('public'));
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api", Router);
app.get("/", (req, res) => {
  res.status(200).json({ massage: "연동 잘 됨." });
});

module.exports = app;

http.createServer(app).listen(3000);
https.createServer(options, app).listen(443);

// app.listen(port, () => {
//   console.log(port, "포트로 서버가 열렸어요!");
// });
