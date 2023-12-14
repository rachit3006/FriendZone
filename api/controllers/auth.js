import { db } from "../connect.js";
import bcrypt from "bcryptjs";
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


export const register = (req, res) => {
  //CHECK USER IF EXISTS

  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) {
      log.error(new Error("Error connecting to database"));
      return res.status(500).json(err);
    }
    if (data.length) {
      log.warn("User already exists");
      return res.status(409).json("User already exists!");
    }
    //CREATE A NEW USER
    //Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];

    db.query(q, [values], (err, data) => {
      if (err) {
        log.error(new Error("Error connecting to database"));
        return res.status(500).json(err);
      }
      log.info("New user registered");
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  
  db.query(q, [req.body.username], (err, data) => {
    if (err) {
      log.error(new Error("Error connecting to database"));
      return res.status(500).json(err);
    }
    if (data.length === 0){
      log.warn("User does not exist")
      return res.status(404).json("User not found!");
    }

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword){
      log.warn("Wrong password or username")
      return res.status(400).json("Wrong password or username!");
    }
    
    const token = jwt.sign({ id: data[0].id }, "secretkey");

    const { password, ...others } = data[0];

    log.info("User logged in")

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  log.info("User logged out")
  res.clearCookie("accessToken",{
    secure:true,
    sameSite:"none"
  }).status(200).json("User has been logged out.")
};

export const search = (req, res) => {
  const q = "SELECT id FROM users WHERE username = ?";

  db.query(q, [req.body.name], (err, data) => {
    if (err) {
      log.error(new Error("Error connecting to database"));
      return res.status(500).json(err);
    }
    if (data.length === 0){
      log.warn("Searched user not found")
      return res.status(404).json("User not found!");
    }

    log.info("Search completed")
    res.status(200).json(data[0]);
  });
}