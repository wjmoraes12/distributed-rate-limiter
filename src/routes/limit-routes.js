import { Router } from "express";
import LimitController from "../controllers/limit-controller.js";

const router = Router();

router.get("/", (req, res) => LimitController.health(req, res));

router.post("/check", (req, res) => LimitController.consume(req, res));

router.post("/getAll", (req, res) => LimitController.getAll(req, res));



export default router;