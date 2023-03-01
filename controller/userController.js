const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { response } = require("express");

// Register
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    // tạo mới user
    const newUser = new User(req.body);
    try {
      const savedUser = await newUser.save();
      res.send({ success: true, data: savedUser });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    // user đã tồn tại
    throw new Error("Thông tin người dùng đã tồn tại");
  }
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const data = {
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      accessToken: generateToken(findUser?._id),
    };
    res.send({ success: true, data: data });
  } else {
    throw new Error("Thông tin không hợp lệ");
  }
});

// Update Information User 
const updateInformationUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName: req?.body.firstName,
        lastName: req?.body.lastName,
        email: req?.body.email,
        mobile: req?.body.mobile,
      },
      {
        new: true
      }
    )
    res.send({ message: "Cập nhật thông tin thành công", data: updatedUser })
  } catch (error) {
    throw new Error(error)
  }
});

// Get All User
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getListUser = await User.find();
    res.send({ data: getListUser, total: getListUser.length });
  } catch (error) {
    throw new Error(error);
  }
});

// Get Single User
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getUserById = await User.findById(id);
    res.send({ data: getUserById });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete User 
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndRemove(id);
    res.send({ status: true, message: "Đã xóa thông tin tài khoản thành công" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getUserById,
  deleteUser,
  updateInformationUser
};
