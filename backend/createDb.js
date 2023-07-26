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

const createTables = () => {
  const sqlOne = `CREATE TABLE users(
users_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
user_name VARCHAR(20) NOT NULL,
email VARCHAR(50) NOT NULL,
password VARCHAR(32) NOT NULL
)`;

  const sqlTwo = `CREATE TABLE recovery_data(
  recovery_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  email VARCHAR(50) NOT NULL, 
  validation_code VARCHAR(10) NOT NULL, 
  expiration_date CHAR(50) NOT NULL
  )`;

  const sqlThree = `CREATE TABLE prog_languages(
    prog_languages_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    prog_languages_name VARCHAR(20) NOT NULL,
    description TEXT NOT NULL
    )`;

  const sqlFour = `CREATE TABLE prog_languages_usages(
      usages_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
      usages VARCHAR(50) NOT NULL,
      description TEXT NOT NULL
      )`;
  const sqlFive = `CREATE TABLE statistics(
    statistics_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    prog_language_name VARCHAR(20) NOT NULL,
    statistic_year INT NOT NULL,
    statistic_percentage DECIMAL(11,3) NOT NULL
    )`;

  const sqlSix = `CREATE TABLE languages_usages (
    languages_usages_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    prog_languages_id INT NOT NULL,
    usages_id INT NOT NULL
    )`;
  progDiary.query(sqlOne, (err, data) => {
    if (err) console.log(err);
  });
  progDiary.query(sqlTwo, (err, data) => {
    if (err) console.log(err);
  });
  progDiary.query(sqlThree, (err, data) => {
    if (err) console.log(err);
  });
  progDiary.query(sqlFour, (err, data) => {
    if (err) console.log(err);
  });
  progDiary.query(sqlFive, (err, data) => {
    if (err) console.log(err);
  });
  progDiary.query(sqlSix, (err, data) => {
    if (err) console.log(err);
  });
};

const progLanguageInsertInto = () => {
  fs.readFile("./progLanguages.txt", "utf8", (err, dbData) => {
    if (err) return err;
    progDiary.query(dbData, (err, data) => {
      if (err) console.log(err);
    });
  });
};

const progLanguageUsagesInsertInto = () => {
  fs.readFile("./progLanguageUsage.txt", "utf8", (err, dbData) => {
    if (err) return err;
    progDiary.query(dbData, (err, data) => {
      if (err) console.log(err);
    });
  });
};

const statisticsInsertInto = () => {
  fs.readFile("./statistics.txt", "utf8", (err, dbData) => {
    if (err) return err;
    progDiary.query(dbData, (err, data) => {
      if (err) console.log(err);
    });
  });
};

const languagesUsagesInsertInto = () => {
  fs.readFile("./languages_usages.txt", "utf-8", (err, dbData) => {
    if (err) return err;
    progDiary.query(dbData, (err, data) => {
      if (err) console.log(err);
    });
  });
};

createTables();
progLanguageInsertInto();
progLanguageUsagesInsertInto();
statisticsInsertInto();
languagesUsagesInsertInto();

app.listen(8081);
