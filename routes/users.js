const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth_middlewares")
const jwt = require("jsonwebtoken")

const { Users } = require("../models");
// const { Op } = require("sequelize");

router.get("/", (req, res) => {
    res.send("welcome to users")
})

// router.get("/me", authMiddleware, async(req,res) =>{
//     const { user } = res.locals
//     res.send({
//         user: {
//             nickname: user.nickname
//         }
//     })
// })

router.post("/login", async (req, res) => {
    try {
        const { loginId, password } = req.body

        const user = await Users.findOne({ where: { loginId, password } })
        if (!user) {
            res.status(400).send({
                errorMessage: '잘못된 닉네임 또는 패스워드입니다.'
            })
            return
        }

        const token = jwt.sign({ privatekey: user.userId }, "secret_key")
        res.send({
            token
        })
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 알맞지 않습니다."
        })
    }
})

router.post("/signup", async (req, res) => {
    try {
        const Idtest = /^[a-zA-z0-9]{3,}/;
        const Pwtest = /^.{4,}$/;
        const { loginId, password, confirm } = req.body;

        if (!Idtest.test(loginId)) {
            res.status(400).send({
                errorMessage: "닉네임 형식과 맞지 않습니다."
            })
            return
        }
        if (!Pwtest.test(password) || password.search(loginId) > -1) {
            res.status(400).send({
                errorMessage: "패스워드 형식과 맞지 않습니다."
            })
            return
        }

        if (password !== confirm) {
            res.status(400).send({
                errorMessage: "패스워드가 패스워드 확인란과 일치하지 않습니다."
            })
            return
        }
        // const existUsers = await users.findAll({
        //     where: { [Op.or]: [{ userId }, { password }] }
        // })
        // if (existUsers.length){
        //     res.status(400).send({
        //         errorMessage: '이미 가입된 이메일 또는 닉네임이 있습니다.'
        //     })
        //     return
        // }
        console.log(loginId, password)
        await Users.create({ loginId, password })
        res.status(201).send({
            Message: "회원가입이 완료 되었습니다."
        });

    } catch (err) {
        console.log(err)
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 알맞지 않습니다."
        })
    }
})



module.exports = router;