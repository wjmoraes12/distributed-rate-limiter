import express from "express";

import limitRoutes from "./routes/limit-routes.js";

import {

    loggerMiddleware,

    errorMiddleware

} from "./config/bootstrap.js";

const app = express();

app.use(express.json());

app.use(loggerMiddleware);

app.use("/", limitRoutes);

app.use(errorMiddleware);

export default app;