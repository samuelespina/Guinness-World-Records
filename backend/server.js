const express = require("express");
const mysql = require("mysql");
const cors = require("cors"); //sicurezza sulle api create
var md5 = require("md5");
var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "recoveryserviceprd@gmail.com",
    pass: "bzxbosgxxmswtjrl",
  },
});

const app = express();
app.use(cors());
app.use(express.json()); //il body della res e della req delle api sono già formattate in json

const prog_diary = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "prog_diary",
});

app.get("/get-programming-languages", (req, res) => {
  const sql = `SELECT	prog_languages_name FROM prog_languages`;
  prog_diary.query(sql, (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) {
      const allLanguages = [];
      for (i = 0; i < data.length; i++) {
        allLanguages.push(data[i].prog_languages_name);
      }
      res.send(allLanguages);
    } else {
      res.send(false);
    }
  });
});

app.get("/get-usages", (req, res) => {
  const sql = `SELECT usages FROM prog_languages_usages`;
  prog_diary.query(sql, (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) {
      const usages = [];

      for (i = 0; i < data.length; i++) {
        usages.push(data[i].usages);
      }
      res.send(usages);
    } else {
      res.send(false);
    }
  });
});

app.post("/get-description", (req, res) => {
  const sql = `SELECT description FROM prog_languages WHERE prog_languages_name = ?`;
  const values = [req.body.id];
  prog_diary.query(sql, [values], (err, data) => {
    if (err) console.log(err);
    if (data.length > 0) {
      const description = data[0].description;
      res.send(description);
    } else {
      res.send(false);
    }
  });
});

app.post("/get-related-languages", (req, res) => {
  const sql = `SELECT prog_languages.prog_languages_name, prog_languages_usages.description, prog_languages.language_icon
  FROM prog_languages
  INNER JOIN languages_usages
  ON prog_languages.prog_languages_id = languages_usages.prog_languages_id
  INNER JOIN prog_languages_usages
  ON prog_languages_usages.usages_id = languages_usages.usages_id AND prog_languages_usages.usages= ? `;
  const values = [req.body.id];
  prog_diary.query(sql, [values], (err, data) => {
    if (err) console.log(err);
    if (data.length > 0) {
      let relatedLanguages = [];
      for (i = 0; i < data.length; i++) {
        relatedLanguages.push({
          languageName: data[i].prog_languages_name,
          icon: data[i].language_icon,
        });
      }
      console.log(relatedLanguages);
      const usageDescription = data[0].description;
      res.send([relatedLanguages, usageDescription]);
    } else {
      res.send("ciaop");
    }
  });
});

app.post("/get-statistics", (req, res) => {
  const sql = `SELECT statistic_percentage, statistic_year
  FROM statistics
  WHERE prog_language_name = ?
  GROUP BY statistic_year ASC`;
  const values = [req.body.id];
  prog_diary.query(sql, [values], (err, data) => {
    if (err) console.log(err);
    if (data.length > 0) {
      const statistics = [];
      for (let i = 0; i < data.length; i++) {
        statistics.push({
          percentage: data[i].statistic_percentage,
          year: data[i].statistic_year,
        });
      }
      console.log(statistics);
      res.send(statistics);
    } else {
      res.send(false);
    }
  });
});

app.post("/signup", (req, res) => {
  const sql = "INSERT INTO users (`user_name`, `email`, `password`) Values (?)";
  const values = [req.body.user_name, req.body.email, md5(req.body.password)];
  prog_diary.query(sql, [values], (err, data) => {
    if (err) return res.json(err);
    res.send(true);
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  prog_diary.query(
    sql,
    [req.body.email, md5(req.body.password)],
    (err, data) => {
      if (err) return res.json("Error");
      if (data.length > 0) {
        res.send(true);
      } else {
        res.send(false);
      }
    }
  );
});

app.post("/forgot-password", (req, res) => {
  const sql1 = `DELETE FROM recovery_data WHERE email = ? `;
  const values1 = [req.body.email];
  const sql2 =
    "INSERT INTO recovery_data (`email`, `validation_code`, `expiration_date`) Values (?)";
  const date = Date.now() + 60000;
  const values2 = [req.body.email, req.body.validationCode, date];

  prog_diary.query(sql1, [values1], (err, data) => {
    if (err) {
      return console.log(err);
    }
  });

  prog_diary.query(sql2, [values2], (err, data) => {
    if (err) return res.send(err);

    const mailOptions = {
      from: "recoveryservice404@gmail.com",
      to: req.body.email,
      subject: "Reset your password",
      text: `Use your validation code : ${req.body.validationCode}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("DIOOOOOOOOOOOOOOOOOO", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.send(true);
  });
});

app.post("/recovery-password", (req, res) => {
  const sql = `SELECT * FROM recovery_data WHERE email  = ? AND validation_code = ?`;
  prog_diary.query(
    sql,
    [req.body.email, req.body.validationCode],
    (err, data) => {
      if (err) return res.json(err);
      if (Date.now() < parseInt(data[0].expiration_date)) {
        if (data.length > 0) {
          console.log(
            "data di submit : ",
            Date.now(),
            "data di scadenza : ",
            data[0].expiration_date
          );
          res.send(true);
        } else {
          res.send(false);
        }
      } else {
        console.log(
          "data di submit : ",
          Date.now(),
          "data di scadenza : ",
          data[0].expiration_date
        );

        res.send(false);
      }
    }
  );
});

app.post("/reset-password", (req, res) => {
  const sql = `UPDATE users SET password = ? WHERE email = ?`;
  prog_diary.query(
    sql,
    [md5(req.body.password), req.body.email],
    (err, data) => {
      if (err) return res.json(err);
      res.send(true);
    }
  );
});

app.listen(8081);
