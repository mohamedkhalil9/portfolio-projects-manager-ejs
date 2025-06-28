import express from "express";
import "dotenv/config";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import passport from "passport";
import { notFound, globalErrorHandler } from "./middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import YAML from "js-yaml";
import fs from "fs";
import appRouter from "./routes/index.js";

// dev and prod ENVs
// automation testing
const app = express();

app.use(morgan("dev"));
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use("/api", apiLimiter);

app.use(helmet());
app.use(compression());
app.use(
  cors({
    credentials: true,
  }),
);
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(passport.initialize());

const yamlFile = fs.readFileSync("src/utils/swagger.yaml", "utf8");
const swaggerDocument = YAML.load(yamlFile);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1", appRouter);

app.all("*", notFound);
app.use(globalErrorHandler);

export default app;
