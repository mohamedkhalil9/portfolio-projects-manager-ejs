import Project from "../models/projectModel.js";
import * as factory from "./factory.js";

export const createProject = factory.createOne(Project, "currentUser");
export const getCurrentUserProjects = factory.getAll(Project, "currentUser");
export const getProjects = factory.getAll(Project, "publicAccess");
export const getProject = factory.getOne(Project);
export const deleteProject = factory.deleteOne(Project);
export const updateProject = factory.updateOne(Project);
