import { Router } from "express";
import LimitController from "../controllers/limit-controller.js";

const router = Router();

router.get("/", (req, res) => LimitController.health(req, res));

router.post("/check", (req, res) => LimitController.consume(req, res));

router.get("/bucket", (req, res) => LimitController.getBucket(req, res));

router.delete("/reset", (req, res) => LimitController.reset(req, res));

router.delete("/reset-all", (req, res) => LimitController.resetAll(req, res));

export default router;