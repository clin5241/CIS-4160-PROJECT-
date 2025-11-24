import dotenv from "dotenv";
dotenv.config();

console.log(">>> APP.JS EXECUTED <<<");
console.log("Loaded USDA key:", process.env.USDA_KEY);

import createError from "http-errors";
import express, { json, urlencoded } from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";

// Routers
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import usdaRouter from "./routes/usda.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set("views", join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/usda", usdaRouter);

app.use((req, res, next) => {
 next(createError(404));
});

app.use((err, req, res, next) => {
 res.locals.message = err.message;
 res.locals.error =
   req.app.get("env") === "development" ? err : {};
 res.status(err.status || 500);
 res.render("error");
});

export default app;


