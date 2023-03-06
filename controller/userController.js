const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

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
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    const data = {
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      accessToken: generateToken(findUser?._id),
    };
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.send({ success: true, data: data });
  } else {
    throw new Error("Thông tin không hợp lệ");
  }
});
// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie.refreshToken) throw new Error("No refresh token in cookie");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user)
    throw new Error("No refresh token present in database or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (error, decoded) => {
    if (error || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.send({ success: true, accessToken });
  });
});
// logout
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("No refresh token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookies("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); 
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookies("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204); // forbidden
});
// Update Information User
const updateInformationUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req?.body.firstName,
        lastName: req?.body.lastName,
        email: req?.body.email,
        mobile: req?.body.mobile,
      },
      {
        new: true,
      }
    );
    res.send({ message: "Cập nhật thông tin thành công", data: updatedUser });
  } catch (error) {
    throw new Error(error);
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
  validateMongoDbId(id);
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
  validateMongoDbId(id);
  try {
    await User.findByIdAndRemove(id);
    res.send({
      status: true,
      message: "Đã xóa thông tin tài khoản thành công",
    });
  } catch (error) {
    throw new Error(error);
  }
});
// block user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.send({ status: true, message: "Đã khóa user thành công" });
  } catch (error) {
    throw new Error(error);
  }
});
// unblock user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.send({ status: true, message: "Đã mở khóa user thành công" });
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
  updateInformationUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
};
