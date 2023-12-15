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

export const getRelationships = (req,res)=>{
    const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

    db.query(q, [req.query.followedUserId], (err, data) => {
      if (err) {
        log.error(new Error("Error connecting to database"));
        return res.status(500).json(err);
      }
      log.info("Relationships fetched")
      return res.status(200).json(data.map(relationship=>relationship.followerUserId));
    });
}

export const addRelationship = (req, res) => {
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

    const q = "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.userId
    ];

    db.query(q, [values], (err, data) => {
      if (err) {
        log.error(new Error("Error connecting to database"));
        return res.status(500).json(err);
      }
      log.info("User followed")
      return res.status(200).json("Following");
    });
  });
};

export const deleteRelationship = (req, res) => {

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

    const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) {
        log.error(new Error("Error connecting to database"));
        return res.status(500).json(err);
      }
      log.info("User unfollowed")
      return res.status(200).json("Unfollow");
    });
  });
};