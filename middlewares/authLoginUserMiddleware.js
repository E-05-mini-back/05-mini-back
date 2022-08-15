require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(" ");

    if (tokenType == "Bearer") {
      res.status(401).json({
        ok: false,
        errorMessage: "이미 로그인 하셨습니다!",
      });
      return;
    }
  } catch (error) {
    next();
  }
};
