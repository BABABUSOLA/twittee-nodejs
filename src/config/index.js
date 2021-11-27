import { merge } from "lodash";
import { config as devConfig } from "./dev";
import { config as prodConfig } from "./prod";
const env = process.env.NODE_ENV || "development";

const baseConfig = {
  env,
  port: 3000,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: "100d",
  },
};

let envConfig;

switch (env) {
  case "dev":
  case "development":
    envConfig = devConfig;
    break;
  case "prod":
  case "production":
    envConfig = prodConfig;
    break;
  default:
    envConfig = devConfig;
}

export default merge(baseConfig, envConfig);
