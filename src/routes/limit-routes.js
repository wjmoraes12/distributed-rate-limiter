import { Router } from "express";
import { controller, validateCheckRequestMiddleware} from "../config/bootstrap.js";
import { security } from "../config/composition-root.js";
 
const router = Router();

router.get("/", (req, res) =>
    controller.health(req, res)
);

router.get("/buckets", (req, res) =>
    controller.getAll(req, res)
);

router.get(
    "/buckets/:id",
    validateCheckRequestMiddleware,
    (req, res) => controller.getBucketByKey(req, res)
);

router.post(
    "/check",
    security,
    (req, res) => controller.consume(req, res)
);

router.delete("/buckets", (req, res) =>
    controller.deleteAllBuckets(req, res)
);

router.delete("/buckets/:id", 
    validateCheckRequestMiddleware,
    (req, res) =>controller.deleteBucketById(req, res)
);

router.patch("/buckets/:id/reset", 
    validateCheckRequestMiddleware,
    (req, res) => controller.resetBucket(req, res)
);

export default router;