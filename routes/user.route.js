const express=require("express");
const router=express.Router();
const {registerUser, userLogin, logOutUser}=require("../controllers/user.controller");
router.post('/register', registerUser );
router.post("/login",userLogin);
router.get("/logout",logOutUser)

module.exports=router;