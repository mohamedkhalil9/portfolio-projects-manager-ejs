import User from "../models/userModel.js";
import * as factory from "./factory.js";

const getUsers = factory.getAll(User);
const getUser = factory.getOne(User);
const deleteUser = factory.deleteOne(User);
const updateUser = factory.updateOne(User);

export { getUsers, getUser, deleteUser, updateUser };
