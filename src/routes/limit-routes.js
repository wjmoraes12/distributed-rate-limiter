import { Router } from "express";
import { controller } from "../config/bootstrap.js";
const router = Router();

router.get("/", (req, res) => controller.health(req, res));
router.get("/buckets", (req, res) => controller.getAll(req, res));
router.get("/buckets/:id", (req, res) => controller.getBucketByKey(req, res));

router.post("/check", (req, res) => controller.consume(req, res));

router.delete("/buckets", (req, res) => controller.deleteAllBuckets(req, res));
router.delete("/buckets/:id", (req, res) => controller.deleteBucketById(req, res));

router.patch("/buckets/:id/reset", (req, res) => controller.resetBucket(req, res));

export default router;