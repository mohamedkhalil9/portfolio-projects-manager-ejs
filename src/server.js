import http from "http";
import app from "./app.js";
import dbConnect from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

const PORT = process.env.PORT;

const server = http.createServer(app);

dbConnect();
connectCloudinary();

// TODO: process.exit() ?
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

// server.on("listening", () => console.log("using on listening"));
