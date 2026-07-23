import express from "express";
import limitRoutes from "./routes/limit-routes.js";
import errorMiddleware from "./middlewares/error-middleware.js";

const app = express();

app.use(express.json());

app.use("/", limitRoutes);
app.use(errorMiddleware);

export default app;