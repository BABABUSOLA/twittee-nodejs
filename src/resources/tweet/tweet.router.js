import { Router } from "express";
import {
  createOne,
  deleteOne,
  getOne,
  getMany,
  validateTweetId,
} from "./tweet.controller";
import favoriteRouter from "./favorite/favorite.router";
import retweetRouter from "./retweet/retweet.router";
import bookmarkRouter from "./bookmark/bookmark.router";

const router = Router();

router.post("/", createOne);

router.use("/:id", validateTweetId);

router.get("/", getMany);
router.get("/:id", getOne);
router.delete("/:id", deleteOne);

router.use("/:id/favorite", favoriteRouter);
router.use("/:id/retweet", retweetRouter);
router.use("/:id/bookmark", bookmarkRouter);

export default router;
