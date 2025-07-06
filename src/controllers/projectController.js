import Project from "../models/projectModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import * as factory from "./factory.js";

export const createProject = factory.createOne(Project, "currentUser");
export const getCurrentUserProjects = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const projects = await Project.find({ user: id });

  res.status(200).render("projects/view-projects-2", { projects });
  // .json({ status: "success", results: projects.length, data: projects });
});
export const getProjects = factory.getAll(Project, "publicAccess");
export const getProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  res.status(200).render("projects/view-project-2", { project });
});
export const deleteProject = factory.deleteOne(Project);
export const updateProject = factory.updateOne(Project);
