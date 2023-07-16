const express = require("express");
const fs = require("fs");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const progDiary = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "prog_diary",
});

fs.readFile("./dbData.txt", "utf8", (err, dbData) => {
  if (err) return err;
});

const createTables = () => {
  const sqlOne = `CREATE TABLE users (
        user_id 
        )
        `;
  progDiary.query(sqlOne, (err, data) => {
    if (err) return res.json(err);
  });
};

createTables();

app.listen(8081);
