import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import winston from "winston"

const log = winston.createLogger({
  // Log only if level is less than (meaning more severe) or equal to this
  level: "info",
  // Use timestamp and printf to create a standard log format
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  // Log to the console and a file
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = ? ORDER BY c.createdAt DESC
    `;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) {
      log.error(new Error("Error connecting to database"));;
      return res.status(500).json(err);
    }
    log.info("Comments fetched")
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    log.error(new Error("User not authenticated"))
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      log.error(new Error("Invalid token"))
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
        log.error(new Error("Error connecting to database"));
        return res.status(500).json(err);
      }
      log.info("New comment created")
      return res.status(200).json("Comment has been created.");
    });
  });
};

export const deleteComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    log.error(new Error("User not authenticated"))
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) {
      log.error(new Error("Invalid token"))
      return res.status(403).json("Token is not valid!");
    }

    const commentId = req.params.id;
    const q = "DELETE FROM comments WHERE `id` = ? AND `userId` = ?";

    db.query(q, [commentId, userInfo.id], (err, data) => {
      if (err) {
        log.error(new Error("Error connecting to database"));
        return res.status(500).json(err);
      }
      if (data.affectedRows > 0){
        log.info("Comment deleted")
        return res.json("Comment has been deleted!");
      }
      log.warn("Can not delete other user's comment");
      return res.status(403).json("You can delete only your comment!");
    });
  });
};