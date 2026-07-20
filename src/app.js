import express from "express";
import limitRoutes from "./routes/limit-routes.js";

const app = express();

app.use(express.json());

app.use("/", limitRoutes);


export default app;