import mongoose from "mongoose";
import config from "../config";

export const connect = (
  url = config.dbURL,
  opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
) => {
  return mongoose.connect(url, opts);
};
