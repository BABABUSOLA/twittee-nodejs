import { Tweet } from "../tweet.model";

export const createOne = async (req, res) => {
  try {
    const tweet = await Tweet.findOneAndUpdate(
      { _id: req.params.id, favorited_by_list: { $nin: [req.user._id] } },
      {
        $push: {
          favorited_by_list: req.user._id,
        },
      }
    );
    if (!tweet) {
      return res
        .status(400)
        .send({ message: "You've already favorited this tweet." });
    }
    res.status(200).send({ favorited: true });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ message: "Something went wrong. Please try again later." });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const tweet = await Tweet.findOneAndUpdate(
      { _id: req.params.id, favorited_by_list: { $in: req.user._id } },
      {
        $pull: {
          favorited_by_list: req.user._id,
        },
      }
    );

    if (!tweet) {
      return res
        .status(400)
        .send({ message: "You've already unfavorited this tweet." });
    }

    res.status(200).send({ favorited: false });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ message: "Something went wrong. Please try again later." });
  }
};
