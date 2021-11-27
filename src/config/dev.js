export const config = {
  secrets: {
    jwt: "devsecret",
  },
  dbURL: "mongodb://localhost:27017/twitter-clone",
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  },
};
