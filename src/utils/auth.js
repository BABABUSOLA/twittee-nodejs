import config from "../config";
import { User } from "../resources/user/user.model";
import jwt from "jsonwebtoken";

export const newToken = (user) => {
  return jwt.sign(
    { id: user.id, screenName: user.screen_name },
    config.secrets.jwt,
    {
      expiresIn: config.secrets.jwtExp,
    }
  );
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
};

export const signup = async (req, res) => {
  if (
    !req.body.email ||
    !req.body.screen_name ||
    !req.body.name ||
    !req.body.date_of_birth ||
    !req.body.password
  )
  {
    const message = `Missing parameter ${[
      "email",
      "screen_name",
      "name",
      "date_of_birth",
      "password",
    ]
      .filter((param) => !req.body.hasOwnProperty(param))
      .join(", ")}`;
    return res.status(400).json({ message });
  }

  try {
    const user = await User.create(req.body);
    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    console.log(e);
    return res.status(400).end();
  }
};

export const signin = async (req, res) => {
  const invalid = {
    message:
      "The username and password you entered did not match our records. Please double-check and try again.",
  };

  if (!req.body.email || !req.body.password) {
    return res.status(400).send(invalid);
  }

  try {
    const user = await User.findOne({ email: req.body.email })
      .select("screen_name password")
      .exec();
    if (!user) {
      return res.status(400).send(invalid);
    }

    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).send(invalid);
    }

    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ message: "Something went wrong. Please try again." });
  }

  const token = bearer.split("Bearer ")[1];

  let payload;

  try {
    payload = await verifyToken(token);
  } catch (e) {
    console.log(e);
    return res.status(401).end();
  }

  const user = await User.findById(payload.id)
    .select("_id screen_name")
    .lean()
    .exec();

  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
};
