import express, { json, urlencoded } from "express";
import cors from "cors";
import path from "path";
import config from "./config";
import { connect } from "./utils/db";

import userRouter from "./resources/user/user.router";
import tweetRouter from "./resources/tweet/tweet.router";
import { signin, signup, protect } from "./utils/auth";

export const app = express();

app.disable("x-powered-by");

app.use(cors());
app.use(json({ limit: "25mb" }));
app.use(urlencoded({ extended: true, limit: "25mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/signin", signin);
app.post("/api/signup", signup);

app.use("/api/", protect);
app.use("/api/user", userRouter);
app.use("/api/tweet", tweetRouter);

export const start = async () => {
  try {
    await connect();
    app.listen(config.port, () => {
      console.log(`API on http://localhost:3000/api`);
    });
  } catch (e) {
    console.error(e);
  }
};
