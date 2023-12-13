import mysql from "mysql"

export const db = mysql.createPool({
  host: process.env.MYSQL_HOST_IP || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "password",
  database: process.env.MYSQL_DATABASE || "social",
});