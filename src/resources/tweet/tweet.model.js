import mongoose from "mongoose";
import { User } from "../user/user.model";

const tweetSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      maxlength: 140,
      trim: true,
    },
    media_url: {
      type: String,
    },
    in_repy_to_user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
    in_reply_to_status_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "tweet",
    },
    retweeted_status_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "tweet",
    },
    created_by: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    retweeted_by_list: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
    },
    favorited_by_list: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
    },
    bookmarked_by_list: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
    },
    statuses_list: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "tweet" }],
    },
  },
  { timestamps: true }
);

tweetSchema.pre("save", async function (next) {
  await User.updateOne(
    { _id: this.created_by },
    { $push: { tweets_list: this._id } }
  );
  next();
});

tweetSchema.pre("findOneAndDelete", async function (next) {
  const tweet = await this.model.findOne(this.getQuery());

  await User.updateOne(
    { _id: tweet.created_by },
    { $pull: { tweets_list: tweet._id } }
  );

  next();
});

tweetSchema.virtual("retweet_count").get(function () {
  return this.retweeted_by_list.length ? this.retweeted_by_list.length : 0;
});

tweetSchema.virtual("favorites_count").get(function () {
  return this.favorited_by_list.length ? this.favorited_by_list.length : 0;
});

tweetSchema.virtual("statuses_count").get(function () {
  return this.replies_by_list ? this.replies_by_list.length : 0;
});

export const Tweet = mongoose.model("tweet", tweetSchema);
