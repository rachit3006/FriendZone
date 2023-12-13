import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import nodeFileLogger from "node-file-logger";

const log = nodeFileLogger

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) {
      log.Error('Error connecting to database')
      return res.status(500).json(err);
    }
    log.Info("User profile fetched")
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    log.Error("User not authenticated")
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      log.Error("Invalid token")
      return res.status(403).json("Token is not valid!");
    }

    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) {
          log.Error('Error connecting to database')
          return res.status(500).json(err);
        }
        if (data.affectedRows > 0) {
          log.Info("User profile updated")
          return res.json("Updated!");
        }
        log.Warn("Can not update other user's profile")
        return res.status(403).json("You can update only your user!");
      }
    );
  });
};