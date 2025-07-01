import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { apiFeatures } from "../utils/apiFeatures.js";

export const createOne = (Model, user) =>
  asyncHandler(async (req, res) => {
    const data = req.body;
    if (user === "currentUser") user = req.user.id;

    const doc = await Model.create({
      user,
      ...data,
    });

    res.status(201).json({ status: "success", data: doc });
  });

export const getAll = (Model, user) => {
  return asyncHandler(async (req, res) => {
    const { query, fields, sort, skip, limit } = apiFeatures(req.query);

    if (user === "currentUser") user = req.user.id;
    if (user === "publicAccess") user = req.body.id;
    const documents = await Model.find({ $and: [{ user }, query] })
      .select(fields)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    res
      .status(200)
      .json({ status: "success", results: documents.length, data: documents });
  });
};

export const getOne = (Model, user) =>
  asyncHandler(async (req, res) => {
    const id = user === "currentUser" ? req.user.id : req.params.id;
    // const { id } = req.params;
    const doc = await Model.findById(id).select("-password");
    if (!doc) throw new AppError("document not found", 404);
    res.status(200).json({ status: "success", data: doc });
  });

export const deleteOne = (Model, user) => {
  return asyncHandler(async (req, res) => {
    // const { id } = req.params;
    const id = user === "currentUser" ? req.user.id : req.params.id;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) throw new AppError(`there is no document with this id`, 404);
    res.status(200).json({ status: "success", data: null });
  });
};

export const updateOne = (Model, user) =>
  asyncHandler(async (req, res) => {
    console.log(user);
    const id = user === "currentUser" ? req.user.id : req.params.id;
    console.log(user);
    // const { id } = req.params;
    const data = req.body;
    console.log(data);

    const doc = await Model.findByIdAndUpdate(id, data, {
      new: true,
    }).select("-password");
    if (!doc) throw new AppError(`there is no document with this id`, 404);

    res.status(200).json({ status: "success", data: doc });
  });
