const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();
const { Users } = require("../models");
const loginmiddleware = require("../middlewares/authLoginUserMiddleware");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { Op } = require("sequelize");

require("dotenv").config();

//Bcrypt 암호화
const salt = 12;

// 유효성 검사 틀
const re_loginId = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
const re_password = /^[A-Za-z0-9]{8,20}$/;

const userSchema = Joi.object({
  loginId: Joi.string().pattern(re_loginId).required(),
  password: Joi.string().pattern(re_password).required(),
  confirm: Joi.string(),
});

// function isRegexValidation(target, regex) {
//   return target.search(regex) !== -1;
// }

//회원가입 api
router.post("/signup", loginmiddleware, async (req, res) => {
  try {
    const { loginId, password, confirm } = await userSchema.validateAsync(
      req.body
    );
    
   

    if (password !== confirm) {
      return res.status(412).json({
        ok: false,
        errorMessage: "패스워드가 일치하지 않습니다.",
      });
    }
    // if (isRegexValidation(password, loginId)) {
    //   return res.status(412).json({
    //     ok: false,
    //     errorMessage: "패스워드에 아이디가 포함되어 있습니다.",
    //   });
    // }
    const user = await Users.findOne({
      //   attributes: ["userId"],
      where: { loginId },
    });

    if (user) {
      return res.status(412).json({
        ok: false,
        errorMessage: "중복된 ID 입니다.",
      });
    }
    //CreateAt 과 UpdateAt을 지정해주지 않아도 자동으로 값이 입력된다.
    const hash = await bcrypt.hash(password, salt)
    await Users.create({ loginId, password : hash });
    console.log(`${loginId} 님이 가입하셨습니다.`);

    return res
      .status(201)
      .json({ ok: true, message: "회원 가입에 성공하였습니다." });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).json({
      ok: false,
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

//로그인 api

router.post("/login", loginmiddleware, async (req, res) => {
  try {
    const { loginId, password } = req.body;

    const dbhash = await Users.findOne({
      where: { loginId: loginId }
   });
    const match = await bcrypt.compare(password, dbhash.password) //비교하는것
    
    // const user = await Users.findOne({
    //   where: {
    //     [Op.and]: [{ loginId }, { password }],
    //   },
    // });
    
    if (!match) {
      return res.status(412).json({
        ok: false,
        errorMessage: "아이디 또는 패스워드를 확인해주세요.",
      });
    }

    //쿠키 만료시간 설정  getMinutes() + (?)  ?에 몇분후에 만료될것인지 설정
    // const expires = new Date();
    // expires.setMinutes(expires.getMinutes() + 60);

    const token = jwt.sign(
      { privatekey: dbhash.userId, loginId: dbhash.loginId },
      process.env.secret_key
    );
    // res.cookie(process.env.COOKIE_NAME, `Bearer ${token}`, {
    //     expires: expires,
    // });

    return res.status(200).json({ ok: true, token, loginId });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).json({
      ok: false,
      errorMessage: "로그인에 실패하였습니다.",
    });
  }
});

// 아이디 중복 검사
router.post("/idCheck", async (req, res) => {
  try {
    const { loginId } = req.body;

    const existUsers = await Users.findOne({
      where: { loginId },
    });
    if (existUsers) {
      res.status(400).json({
        ok: false,
        errorMessage: "이미 가입된 아이디 입니다.",
      });
      return;
    }

    res.status(201).json({
      ok: true,
      message: "사용 가능한 아이디 입니다.",
    });
  } catch (err) {
    res.status(400).json({
      ok: false,
      errorMessage: "아이디 중복검사에 실패했습니다.",
    });
  }
});

module.exports = router;
