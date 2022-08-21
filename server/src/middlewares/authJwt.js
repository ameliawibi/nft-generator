import model from "../models";
import jwt from "jsonwebtoken";
const JWTSecretKey = process.env.JWT_SECRET_KEY;
const { User } = model;

export default {
  async verifySignUp(req, res, next) {
    try {
      const duplicateEmail = await User.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (duplicateEmail) {
        res.status(400).send({
          message: "Failed! Email is already in use!",
        });
        return;
      }
      next();
    } catch (e) {
      console.log(e);
    }
  },

  async verifyToken(req, res, next) {
    try {
      let token = req.cookies["x-access-token"];

      if (!token) {
        return res.status(403).send({
          message: "No token provided!",
        });
      }
      jwt.verify(token, JWTSecretKey, (err, decoded) => {
        if (err) {
          return res.status(401).send({
            message: "Unauthorized!",
          });
        }
        req.userId = decoded.id;
        next();
      });
    } catch (e) {
      console.log(e);
    }
  },
};
