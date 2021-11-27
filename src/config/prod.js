export const config = {
    secrets: {
      jwt: "devsecret",
    },
    dbURL: "mongodb+srv://dbUser:dbPassword@cluster0.z8nyy.mongodb.net/twitter-clone?retryWrites=true&w=majority",
    cloudinary: {
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    },
  };
