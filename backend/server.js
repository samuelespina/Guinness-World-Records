const express = require("express");
const mysql = require("mysql");
const cors = require("cors"); //sicurezza sulle api create
var md5 = require("md5");
var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "recoveryservice404@gmail.com",
    pass: "szriaupkywnnglfv",
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

const forgotPasswordDb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "forgot_password",
});

const infoProg = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "info",
});

app.get("/get-programming-languages", (req, res) => {
  const sql = `SELECT prog_name FROM prog_descriptions`;
  infoProg.query(sql, (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) {
      const allLanguages = [];
      for (i = 0; i < data.length; i++) {
        allLanguages.push(data[i].prog_name);
      }
      res.send(allLanguages);
    } else {
      res.send(false);
    }
  });
});

app.get("/get-usages", (req, res) => {
  const sql = `SELECT usages FROM languages_usages`;
  infoProg.query(sql, (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) {
      console.log("true");
      const usages = [];

      for (i = 0; i < data.length; i++) {
        usages.push(data[i].usages);
      }
      console.log(usages);
      res.send(usages);
    } else {
      res.send(false);
    }
  });
});

app.post("/get-description", (req, res) => {
  const sql = `SELECT description FROM prog_descriptions WHERE prog_name = ?`;
  const values = [req.body.id];
  infoProg.query(sql, [values], (err, data) => {
    if (err) console.log(err);
    if (data.length > 0) {
      const description = data[0].description;
      res.send(description);
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
      return res.json(err);
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
