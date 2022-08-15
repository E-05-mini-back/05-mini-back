const express =require ("express");
const router = express.Router();
const { Likes } = require("../models");
const authMiddlewares = require("../middlewares/auth_middlewares");

//좋아요 조회

router.get("/likes" ,authMiddlewares,async (req,res)=>{
    try{
        

    }catch(err){

    }
})