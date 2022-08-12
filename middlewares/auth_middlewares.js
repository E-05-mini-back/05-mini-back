const jwt = require('jsonwebtoken')
const { Member } = require("../models")

module.exports = (req, res, next) => {
    try{

        const { authorization } = req.headers;
        const [tokenType, tokenValue] = authorization.split(" ");
        // console.log(tokenValue)
        // console.log(jwt.verify(tokenValue, "secret_key"))
        if (tokenType !== 'Bearer'){
            res.status(401).send({
                errorMessage: '로그인 후 사용하세요',
            })
            return;
        }
        const { privatekey } = jwt.verify(tokenValue, "secret_key")
        Member.findByPk(privatekey).then((member) => {
            res.locals.user = member;
            next();
          });
        
    } catch (error){
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요1',
        })
    }
    
}