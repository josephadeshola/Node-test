const express=require("express");
const router=express.Router();
const {registerUser, userLogin, logOutUser, authUser, userEdit}=require("../controllers/user.controller");
router.post('/register', registerUser );
router.post("/login",userLogin);
router.get("/logout",logOutUser);
router.get("/auth", authUser);
router.post("/update", userEdit);

module.exports=router;