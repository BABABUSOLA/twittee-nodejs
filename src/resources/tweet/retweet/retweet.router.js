import { Router } from "express";
import { createOne, deleteOne } from "./retweet.controller";

const router = Router({ mergeParams: true });

router.post("/", createOne);
router.delete("/", deleteOne);

export default router;
