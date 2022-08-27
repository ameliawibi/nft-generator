import model from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const { User } = model;
const JWTSecretKey = process.env.JWT_SECRET_KEY;

export default {
  async signUp(req, res) {
    try {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
      });

      if (user) {
        return res
          .status(200)
          .send({ message: "User was registered successfully!" });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        message:
          "Could not perform operation at this time, kindly try again later.",
      });
    }
  },

  async signIn(req, res) {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.dataValues.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      const token = jwt.sign({ id: user.dataValues.id }, JWTSecretKey, {
        expiresIn: 86400, // 24 hours
      });

      res.cookie("userId", user.dataValues.id);
      res.cookie("x-access-token", token);

      res.status(200).send({
        id: user.dataValues.id,
        name: user.dataValues.name,
        email: user.dataValues.email,
        accessToken: token,
        message: "Successfully logged in",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        message:
          "Could not perform operation at this time, kindly try again later.",
      });
    }
  },

  async getLogout(_req, res) {
    try {
      res.clearCookie("x-access-token");
      res.clearCookie("userId");
      res.status(200).send({
        message: "Logged out!",
      });
    } catch (e) {
      console.log(e);
    }
  },
};
