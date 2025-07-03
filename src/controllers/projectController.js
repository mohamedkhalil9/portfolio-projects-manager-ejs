import Project from "../models/projectModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import * as factory from "./factory.js";

export const createProject = factory.createOne(Project, "currentUser");
export const getCurrentUserProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find();
  res
    .status(200)
    // .json({ status: "success", results: projects.length, data: projects });
    .render("projects/view-projects-2", { projects });
});
export const getProjects = factory.getAll(Project, "publicAccess");
export const getProject = factory.getOne(Project);
export const deleteProject = factory.deleteOne(Project);
export const updateProject = factory.updateOne(Project);
