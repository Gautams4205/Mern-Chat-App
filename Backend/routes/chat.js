const express = require("express");
const { protect } = require("../middleware/authentication");
const { accessChats, fetchChats, createGroupChat, renameGroup, addtoGroup, removefromGroup } = require("../controller/chat");
const router = express.Router();

router.post("/", protect, accessChats);
router.get("/",protect,fetchChats);
router.post("/group",protect,createGroupChat);
router.put("/rename",protect,renameGroup);
router.put("/groupadd",protect,addtoGroup);
router.put("/groupremove",protect,removefromGroup);

module.exports = router;
