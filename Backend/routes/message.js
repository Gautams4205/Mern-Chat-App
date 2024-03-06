const express = require("express");
const { protect } = require("../middleware/authentication");
const { sendmessage, allmessages } = require("../controller/message");

const router = express.Router();

router.post("/",protect,sendmessage);
router.get("/:chatId",protect,allmessages);

module.exports = router;
