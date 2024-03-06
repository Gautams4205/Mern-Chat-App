const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asynchandler = require("express-async-handler");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token Failed.");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, token Failed.");
  }
};
