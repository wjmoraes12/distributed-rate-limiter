import { Router } from "express";
import LimitController from "../controllers/limit-controller.js";

const router = Router();

router.get("/", (req, res) => LimitController.health(req, res));
router.get("/buckets", (req, res) => LimitController.getAll(req, res));
router.get("/buckets/:id", (req, res) => LimitController.getBucketByKey(req, res));

router.post("/check", (req, res) => LimitController.consume(req, res));

router.delete("/buckets", (req, res) => LimitController.deleteAllBuckets(req, res));
router.delete("/buckets/:id", (req, res) => LimitController.deleteBucketById(req, res));

export default router;