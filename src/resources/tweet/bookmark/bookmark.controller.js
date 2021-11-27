import { Tweet } from "../tweet.model";
import { User } from "../../user/user.model";

export const createOne = async (req, res) => {
  const message = "Something went wrong. Please try again later.";

  try {
    const tweet = await Tweet.findOneAndUpdate(
      {
        _id: req.params.id,
        bookmarked_by_list: { $nin: req.user._id },
      },
      {
        $push: {
          bookmarked_by_list: req.user._id,
        },
      }
    );

    if (!tweet) {
      return res
        .status(400)
        .send({ message: "You 've already bookmarked this tweet." });
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { bookmarks_list: tweet._id } }
    );

    if (!user) {
      return res.status(400).send({ message });
    }

    res.status(200).send({ bookmarked: true });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const tweet = await Tweet.findOneAndUpdate(
      {
        _id: req.params.id,
        bookmarked_by_list: { $in: req.user._id },
      },
      {
        $pull: {
          bookmarked_by_list: req.user._id,
        },
      }
    );

    if (!tweet) {
      return res
        .status(400)
        .send({ message: "You've already unbookmarked this tweet." });
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { bookmarks_list: tweet._id } }
    );

    if (!user) {
      return res.status(400).send({ message });
    }

    res.status(200).send({ bookmarked: false });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message });
  }
};
