const express = require("express");
const { register, authUser ,getusers} = require("../controller/user");
const {protect}=require("../middleware/authentication")

const router = express.Router();

router.get("/",protect,getusers)
router.post("/signup", register);
router.post("/login", authUser);

module.exports = router;
