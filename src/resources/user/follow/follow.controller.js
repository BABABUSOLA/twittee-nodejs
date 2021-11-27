import { User } from "../user.model";

export const createOne = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        screen_name: req.params.screenName,
        followers_list: {
          $nin: [req.user._id],
        },
      },
      { $push: { followers_list: req.user._id } }
    );
    if (!user) {
      return res
        .status(400)
        .message({ message: "You've already followed this user." });
    }
    await User.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        $push: {
          following_list: user._id,
        },
      }
    );
    return res.status(200).send({ followed: true });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ message: "Something went wrong. Please try again later." });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        screen_name: req.params.screenName,
        followers_list: { $in: [req.user._id] },
      },
      {
        $pull: {
          followers_list: req.user._id,
        },
      }
    );
    if (!user) {
      return res
        .status(400)
        .send({ message: "You've already unfollowed this user." });
    }
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: {
          following_list: user._id,
        },
      }
    );
    return res.status(200).send({ followed: false });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ message: "Something went wrong. Please try again later." });
  }
};
