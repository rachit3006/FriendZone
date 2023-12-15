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

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) {
      log.error(new Error("Error connecting to database"));
      return res.status(500).json(err);
    }
    log.info("User profile fetched")
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
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
          log.error(new Error("Error connecting to database"));
          return res.status(500).json(err);
        }
        if (data.affectedRows > 0) {
          log.info("User profile updated")
          return res.json("Updated!");
        }
        log.warn("Can not update other user's profile")
        return res.status(403).json("You can update only your user!");
      }
    );
  });
};