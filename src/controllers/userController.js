import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import * as factory from "./factory.js";

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res
    .status(200)
    // .json({ status: "success", results: users.length, data: users });
    .render("admin/users-2", { users });
});
const getUser = factory.getOne(User);
const deleteUser = factory.deleteOne(User);
const updateUser = factory.updateOne(User);

export { getUsers, getUser, deleteUser, updateUser };
