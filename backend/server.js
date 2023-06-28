const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
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
app.use(express.json());
const clearResponce = false;

const userdb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "signup_login",
});

const forgotPasswordDb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "forgot_password",
});

app.post("/signup", (req, res) => {
  const sql = "INSERT INTO users (`user_name`, `email`, `password`) Values (?)";
  const values = [req.body.user_name, req.body.email, md5(req.body.password)];
  userdb.query(sql, [values], (err, data) => {
    if (err) return res.json(err);
    res.send(true);
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  userdb.query(sql, [req.body.email, md5(req.body.password)], (err, data) => {
    if (err) return res.json("Error");
    if (data.length > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});

app.post("/forgot-password", (req, res) => {
  const sql1 = `DELETE FROM recovery_data WHERE email = ? `;
  const values1 = [req.body.email];
  const sql2 =
    "INSERT INTO recovery_data (`email`, `validation_code`, `expiration_validation_code`) Values (?)";
  const date = new Date();
  date.setMinutes(date.getMinutes() + 20);
  const values2 = [req.body.email, req.body.validationCode, date];

  forgotPasswordDb.query(sql1, [values1], (err, data) => {
    if (err) {
      return res.json(err);
    }
  });

  forgotPasswordDb.query(sql2, [values2], (err, data) => {
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
  forgotPasswordDb.query(
    sql,
    [req.body.email, req.body.validationCode],
    (err, data) => {
      if (err) return res.json(err);
      if (data[0].expiration_validation_code > new Date()) {
        if (data.length > 0) {
          res.send(true);
        } else {
          res.send(false);
        }
      } else {
        res.send("codice scaduto");
      }
    }
  );
});

app.post("/reset-password", (req, res) => {
  const sql = `UPDATE users SET password = ? WHERE email = ?`;
  userdb.query(sql, [md5(req.body.password), req.body.email], (err, data) => {
    if (err) return res.json(err);
    res.send(true);
  });
});

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(8081);
