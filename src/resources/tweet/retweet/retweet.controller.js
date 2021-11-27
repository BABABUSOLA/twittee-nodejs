import { Tweet } from "../tweet.model";

export const createOne = async (req, res) => {
  const message = "Something went wrong. Please try again later.";

  try {
    const tweet = await Tweet.updateOne(
      { _id: req.params.id, retweeted_by_list: { $nin: [req.user._id] } },
      {
        $push: {
          retweeted_by_list: req.user._id,
        },
      }
    );

    if (!tweet) {
      return res.status(400).send({
        message: "You've already retweed this tweet.",
      });
    }

    const retweet = await Tweet.create({
      created_by: req.user._id,
      retweeted_status_id: req.params.id,
    });

    if (!retweet) {
      return res.status(400).send({ message });
    }

    res.status(200).send({ retweeted: true });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message });
  }
};

export const deleteOne = async (req, res) => {
  const message = "Something went wrong. Please try again later.";

  try {
    const tweet = await Tweet.updateOne(
      { _id: req.params.id, retweeted_by_list: { $in: req.user._id } },
      {
        $pull: {
          retweeted_by_list: req.user._id,
        },
      }
    );

    if (!tweet) {
      return res
        .status(400)
        .send({ message: "You've already unretweeted this tweet." });
    }

    const retweet = await Tweet.findOneAndDelete({
      retweeted_status_id: req.params.id,
      created_by: req.user._id,
    });

    if (!retweet) {
      return res.status(400).send({ message });
    }

    res.status(200).send({ retweeted: false });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message });
  }
};
