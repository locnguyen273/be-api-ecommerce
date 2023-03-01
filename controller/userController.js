const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if(!findUser){
    // tạo mới user
    const newUser = User.create(req.body);
    res.json({success:true, data:newUser})
  } else {
    // user đã tồn tại
    res.json({
      success:false,
      message: "Thông tin người dùng đã tồn tại"
    })
  }
});

module.exports = { createUser };