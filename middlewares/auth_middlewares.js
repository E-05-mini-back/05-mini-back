const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(" ");

    if (tokenType !== "Bearer") {
      res.status(401).json({
        ok: false,
        errorMessage: "토큰 타입이 맞지 않습니다.",
      });
      return;
    }
    try {
      const { privatekey } = jwt.verify(tokenValue, "secret_key");
      Users.findByPk(privatekey).then((userId) => {
        res.locals.user = userId;
        next();
      });
    } catch (err) {
      res.status(401).json({
        ok: false,
        errorMessage: "유효성 검사에 실패했습니다.",
      });
      return;
    }
  } catch (error) {
    res.status(401).json({
      ok: false,
      errorMessage: "로그인 후 사용하세요1",
    });
    return;
  }
};
