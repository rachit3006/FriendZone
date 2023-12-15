import { db } from "../connect.js";
import jwt from "jsonwebtoken";
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

export const getLikes = (req,res)=>{
    const q = "SELECT userId FROM likes WHERE postId = ?";

    db.query(q, [req.query.postId], (err, data) => {
      if (err) {
        log.error(new Error("Error connecting to database"));
        return res.status(500).json(err);
      }
      log.info("Likes fetched")
      return res.status(200).json(data.map(like=>like.userId));
    });
}

export const addLike = (req, res) => {
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

    const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.postId
    ];

    db.query(q, [values], (err, data) => {
      if (err) {
        log.error(new Error("Error connecting to database"));
        return res.status(500).json(err);
      }
      log.info("Post liked")
      return res.status(200).json("Post has been liked.");
    });
  });
};

export const deleteLike = (req, res) => {

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

    const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) {
        log.error(new Error("Error connecting to database"));
        return res.status(500).json(err);
      }
      log.info("Post disliked")
      return res.status(200).json("Post has been disliked.");
    });
  });
};