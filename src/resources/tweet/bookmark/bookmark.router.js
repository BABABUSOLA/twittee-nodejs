import { Router } from "express";
import { createOne, deleteOne } from "./bookmark.controller";

const router = Router({ mergeParams: true });

router.post("/", createOne);
router.delete("/", deleteOne);

export default router;
