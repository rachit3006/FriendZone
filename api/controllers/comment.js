import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import nodeFileLogger from "node-file-logger";

const log = nodeFileLogger

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = ? ORDER BY c.createdAt DESC
    `;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) {
      log.Error('Error connecting to database')
      return res.status(500).json(err);
    }
    log.Info("Comments fetched")
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
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

    const q = "INSERT INTO comments(`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";
    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId
    ];

    db.query(q, [values], (err, data) => {
      if (err) {
        log.Error('Error connecting to database')
        return res.status(500).json(err);
      }
      log.Info("New comment created")
      return res.status(200).json("Comment has been created.");
    });
  });
};

export const deleteComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    log.Error("User not authenticated")
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) {
      log.Error("Invalid token")
      return res.status(403).json("Token is not valid!");
    }

    const commentId = req.params.id;
    const q = "DELETE FROM comments WHERE `id` = ? AND `userId` = ?";

    db.query(q, [commentId, userInfo.id], (err, data) => {
      if (err) {
        log.Error('Error connecting to database')
        return res.status(500).json(err);
      }
      if (data.affectedRows > 0){
        log.Info("Comment deleted")
        return res.json("Comment has been deleted!");
      }
      log.Warn("Can not delete other user's comment");
      return res.status(403).json("You can delete only your comment!");
    });
  });
};