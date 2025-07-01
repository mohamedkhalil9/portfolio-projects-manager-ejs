import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  description: String,
  features: String,
  technologies: [String],
  githubUrl: String,
  prodUrl: String,
  gif: String,
  images: [String],
  video: String,
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
