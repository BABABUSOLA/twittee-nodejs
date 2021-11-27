import { Tweet } from "./tweet.model";
import config from "../../config";
import cloudinary from "cloudinary";
import validator from "validator";

export const validateTweetId = (req, res, next) => {
  if (!validator.isHexadecimal(req.params.id)) {
    return res.status(400).send({ message: "Invalid Tweet id" });
  }
  next();
};

export const createOne = async (req, res) => {
  const message = "Something went wrong. Please try again later.";
  try {
    let mediaUrl;
    if (
      req.body.media &&
      validator.isBase64(
        req.body.media.replace(/^data:([A-Za-z-+/]+);base64,/, "")
      )
    ) {
      cloudinary.v2.config(config.cloudinary);
      await cloudinary.v2.uploader
        .upload(req.body.media, {
          folder: "media",
          unique_filename: true,
          discard_original_filename: true,
        })
        .then((result) => {
          mediaUrl = result.secure_url;
        })
        .catch((error) => {
          console.log(error);
          return res.status(400).send({ message: "Image upload failed." });
        });
    }

    const tweet = await Tweet.create({
      ...req.body,
      created_by: req.user._id,
      media_url: mediaUrl,
    });

    if (!tweet) {
      return res.status(400).send({ message });
    }

    res.status(200).send({ id: tweet._id });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message });
  }
};

export const getMany = async (req, res) => {
  const message = "Something went wrong. Please try again later.";
  try {
    const tweetsData = await Tweet.find({ created_by: req.user._id })
      .select("id")
      .sort("-createdAt")
      .lean()
      .exec();
    if (!tweetsData) {
      return res.status(400).send({ message });
    }
    const tweets = tweetsData.map((tweetData) => tweetData._id);
    res.status(200).send({ tweets });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ message: "Something went wrong. Please try again later." });
  }
};

export const getOne = async (req, res) => {
  try {
    let tweetData = await Tweet.findById(req.params.id)
      .populate("created_by retweeted_status_id")
      .exec();

    if (!tweetData) {
      return res.status(404).send({ message: "This Tweet is unavailable." });
    }

    if (tweetData.retweeted_status_id) {
      tweetData = await tweetData.retweeted_status_id
        .populate("created_by")
        .execPopulate();
    }

    const favorited = !!tweetData.favorited_by_list.filter((id) =>
      id.equals(req.user._id)
    ).length;

    const retweeted = !!tweetData.retweeted_by_list.filter((id) =>
      id.equals(req.user._id)
    ).length;

    const bookmarked = !!tweetData.bookmarked_by_list.filter((id) =>
      id.equals(req.user._id)
    ).length;

    const tweet = {
      id: tweetData._id,
      avatarURL: tweetData.created_by.profile_picture_url,
      name: tweetData.created_by.name,
      handle: tweetData.created_by.screen_name,
      imageURL: tweetData.media_url,
      content: tweetData.text,
      statusesCount: tweetData.statuses_count,
      retweetCount: tweetData.retweet_count,
      favoritesCount: tweetData.favorites_count,
      retweeted,
      favorited,
      bookmarked,
      isSelf: tweetData.created_by._id.equals(req.user._id),
    };

    res.status(200).send({ tweet });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message });
  }
};

export const deleteOne = async (req, res) => {
  const message = "Something went wrong. Please try again later.";

  try {
    const tweet = await Tweet.findOneAndDelete({
      _id: req.params.id,
      created_by: req.user._id,
    });
    if (!tweet) {
      return res.status(400).send({ message });
    }
    if (tweet.retweeted_status_id) {
      return res.status(400).send({ message });
    }
    if (tweet.retweeted_by_list.length) {
      await Tweet.deleteMany({ retweeted_status_id: tweet._id });
    }

    res.status(200).send({ id: req.params.id });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message });
  }
};
