import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Tweet } from "../tweet/tweet.model";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 50,
      required: true,
      trim: true,
    },
    screen_name: {
      type: String,
      maxlength: 15,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    description: {
      type: String,
      maxlength: 160,
    },
    date_of_birth: {
      type: Date,
    },
    location: {
      type: String,
      maxlength: 30,
    },
    url: {
      type: String,
      maxlength: 100,
    },
    followers_list: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
    },
    following_list: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
    },
    profile_picture_url: {
      type: String,
    },
    banner_url: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function checkPassword(password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }
      resolve(same);
    });
  });
};

userSchema.virtual("followers_count").get(function () {
  return this.followers_list.length ? this.followers_list.length : 0;
});

userSchema.virtual("following_count").get(function () {
  return this.following_list.length ? this.following_list.length : 0;
});

userSchema.virtual("tweets_list").get(async function () {
  const tweetsData = await Tweet.find({ created_by: this._id })
    .select("id")
    .sort("createdAt")
    .lean()
    .exec();
  if (!tweetsData) {
    return [];
  }
  const tweets = tweetsData.map((tweetData) => tweetData._id);
  return tweets;
});

userSchema.virtual("bookmarks_list").get(async function () {
  const tweetsData = await Tweet.find({ bookmarked_by_list: { $in: this._id } })
    .select("id")
    .sort("-createdAt")
    .lean()
    .exec();
  if (!tweetsData) {
    return [];
  }
  const tweets = tweetsData.map((tweetData) => tweetData._id);
  return tweets;
});

export const User = mongoose.model("user", userSchema);
