import Project from "../models/projectModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const createProject = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { title, githubUrl, description, technologies } = req.body;

  const technologiesArr = JSON.parse(technologies);
  const projectData = {
    user: id,
    title,
    description,
    technologies: technologiesArr,
    githubUrl,
  };

  const project = await Project.create(projectData);

  res.status(201).redirect(`/api/v1/${id}/projects`);
});

export const getCurrentUserProjects = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const projects = await Project.find({ user: userId });

  res.status(200).render("projects/view-projects-2", { projects });
  // .json({ status: "success", results: projects.length, data: projects });
});

export const getProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  res.status(200).render("projects/view-project-2", { project });
});

export const editProjectView = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  res.render("projects/edit-project", { project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, githubUrl } = req.body;

  const project = await Project.findByIdAndUpdate(
    id,
    { title, description, githubUrl },
    { new: true },
  );
  console.log(project);

  res.status(200).redirect(`/api/v1/projects/${id}`);
});
export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const project = await Project.findByIdAndDelete(id);

  res.status(204).redirect(`/api/v1/${req.user.id}/projects`);
});
