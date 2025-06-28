import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { apiFeatures } from "../utils/apiFeatures.js";

export const getAll = (Model) => {
  return asyncHandler(async (req, res) => {
    const { query, fields, sort, skip, limit } = apiFeatures(req.query);

    const documents = await Model.find(query)
      .select(fields)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    res
      .status(200)
      .json({ status: "success", results: documents.length, data: documents });
  });
};

export const getOne = (Model) =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const doc = await Model.findById(id).select("-password");
    if (!doc) throw new AppError("document not found", 404);
    res.status(200).json({ status: "success", data: doc });
  });

export const deleteOne = (Model) => {
  return asyncHandler(async (req, res) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) throw new AppError(`there is no document with this id`, 404);
    res.status(200).json({ status: "success", data: null });
  });
};

export const updateOne = (Model) =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const doc = await Model.findByIdAndUpdate(id, data, {
      new: true,
    }).select("-password");
    if (!doc) throw new AppError(`there is no document with this id`, 404);

    res.status(200).json({ status: "success", data: doc });
  });
