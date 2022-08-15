const express = require('express');
const Joi = require('joi');
const { Users } = require('../models');
const loginmiddleware = require('../middlewares/authLoginUserMiddleware')
const { Op } = require('sequelize');
const router = express.Router()
const jwt = require('jsonwebtoken');



require("dotenv").config();

const re_loginId = /^[a-zA-Z0-9]{3,10}$/;
const re_password = /^[a-zA-Z0-9]{4,30}$/;

const userSchema = Joi.object({
    loginId: Joi.string().pattern(re_loginId).required(),
    password: Joi.string().pattern(re_password).required(),
    confirm: Joi.string(),
});

//회원가입 api
router.post('/signup',loginmiddleware, async (req, res) => {
    try {
        //닉네임의 시작과 끝이 a-zA-Z0-9글자로 3 ~ 10 단어로 구성되어야 한다.
        const { loginId, password, confirm } = await userSchema.validateAsync(
            req.body
        );

        if (password !== confirm) {
            return res.status(412).send({
                ok: false,
                errorMessage: '패스워드가 일치하지 않습니다.',
            });
        }
        if (isRegexValidation(password, loginId)) {
            return res.status(412).send({
                ok: false,
                errorMessage: '패스워드에 닉네임이 포함되어 있습니다.',
            });
        }
        const user = await Users.findAll({
            attributes: ['userId'],
            where: { loginId },
        });

        if (user) {
            return res.status(412).send({
                ok: false,
                errorMessage: '중복된 ID 입니다.',
            });
        }

        //CreateAt 과 UpdateAt을 지정해주지 않아도 자동으로 값이 입력된다.
        await Users.create({ loginId, password });
        console.log(`${loginId} 님이 가입하셨습니다.`);

        return res.status(201).send({ ok: true, message: '회원 가입에 성공하였습니다.' });
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).send({
            ok: false,
            errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
        });
    }
});

function isRegexValidation(target, regex) {
    return target.search(regex) !== -1;
}

//로그인 api 


router.post('/login',loginmiddleware, async (req, res) => {
    try {

        const { loginId, password } = req.body;
        const user = await Users.findOne({
            where: {
                [Op.and]: [{ loginId }, { password }],
            },
        });


        if (!user) {
            return res.status(412).send({
                ok: false,
                errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
            });
        }


        //쿠키 만료시간 설정  getMinutes() + (?)  ?에 몇분후에 만료될것인지 설정
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 60);

        const token = jwt.sign({ userId: user.userId }, process.env.secret_key);
        // res.cookie(process.env.COOKIE_NAME, `Bearer ${token}`, {
        //     expires: expires,
        // });

        return res.status(200).json({ ok: true, token });
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).send({
            ok: false,
            errorMessage: '로그인에 실패하였습니다.',
        });
    }
});


module.exports = router;