const express=require("express");
const router=express.Router();
const {registerUser, userLogin}=require("../controllers/user.controller");
router.post('/register', registerUser );
router.post("/login",userLogin);
module.exports=router;