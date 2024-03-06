const asynchandler = require("express-async-handler");
const User = require("../models/User");
const { generateToken } = require("../config/generateToken");  

exports.register = asynchandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please entre all the feild");
  }
  const userexit = await User.findOne({ email });
  if (userexit) {
    res.status(400);
    throw new Error("User already exit");
  }
  const user = await User.create({ name, email, password, pic });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create new user.");
  }
});

exports.authUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please entre all the feild");
  }
  const user = await User.findOne({ email });
  if (user && user.matchPassword(user.password)) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to login user.");
  }
});

// /api/user?search
exports.getusers = asynchandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const user = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select("-password");
  res.send(user);
});
