const express = require("express"); //ISSUES : perchè lo vuole qui?
const mysql = require("mysql");
var md5 = require("md5");
var nodemailer = require("nodemailer");
var cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express(); //ISSUES : con app non ci faccio niente, perchè se lo tolgo crasha?
app.use(express.json()); //il body della res e della req delle api sono già formattate in json
app.use(cookieParser());

const prog_diary = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "prog_diary",
}); //ISSUES : se le funzioni vengono messe dentro i routes e tutti i routes vengono usati in server .js , perchè vuole la connessione al db e md5 anche qui?

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "recoveryserviceprd@gmail.com",
    pass: "bzxbosgxxmswtjrl",
  },
}); //ISSUES :  nello stesso modo della connessione con il db, se metto il transporter in server.js non va, se lo metto qui va

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const maxAge = 2 * 24 * 60 * 60;

const createToken = (payload) => {
  //passo il payload da criptare e la chiave
  return jwt.sign({ payload }, "PrOgDiArYsEcReT", { expiresIn: maxAge });
};

/*



CONTROLLERS



*/

module.exports.signup = async (req, res) => {
  const sql1 =
    "INSERT INTO users (`user_name`, `email`, `password`) Values (?)";
  const values1 = [req.body.user_name, req.body.email, md5(req.body.password)];
  const sql2 = `SELECT user_name FROM users WHERE user_name = ? `;
  const sql3 = `SELECT email FROM users WHERE email = ? `;

  try {
    let resMessage = "";

    const firstControl = await prog_diary.query(
      sql2,
      [req.body.user_name],
      (err, data) => {
        if (data.length > 0) {
          resMessage = resMessage + "username";
        }
      }
    );

    const secondControl = await prog_diary.query(
      sql3,
      [req.body.email],
      (err, data) => {
        if (data.length > 0) {
          resMessage = resMessage + "email";
        }
        if (resMessage === "") {
          //ISSUES : funziona solo se metto l'if che gestisce il res dentro l'ultimo try, se non faccio così gestisce questo if asincrono e torna sempre true perchè lo esegue all'inizio, anche se metto gli await(che sicuramente non funzionano)

          if (emailRegex.test(req.body.email)) {
            try {
              prog_diary.query(sql1, [values1], (data) => {
                // creazione del token
                const token = createToken(req.body.email);

                res.send({
                  registrationResult: true,
                  emailstatus: true,
                  token: token,
                });
              });
            } catch (err) {
              console.log(err);
              res.send(false);
            }
          } else {
            res.send({
              registrationResult: false,
              emailstatus: false,
              token: false,
            });
          }
        } else if (resMessage === "usernameemail") {
          res.send({
            registrationResult: "username already registered",
            emailstatus: true,
            token: false,
          });
        } else {
          res.send({
            registrationResult: resMessage,
            emailstatus: emailRegex.test(req.body.email),
            token: false,
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports.login = (req, res) => {
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  try {
    prog_diary.query(
      sql,
      [req.body.email, md5(req.body.password)],
      (err, data) => {
        if (data.length > 0) {
          //creazione del token
          const token = createToken(req.body.email);

          res.send(token);
        } else {
          res.send(false);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports.forgotPassword = (req, res) => {
  const deleatePreValidationCodes = `DELETE FROM recovery_data WHERE email = ? `;
  const deleatePreValidationCodesValues = [req.body.email];
  const ifUserIn = "SELECT email FROM users WHERE email = ?";
  const date = Date.now() + 60000;
  const validationInsert =
    "INSERT INTO recovery_data (`email`, `validation_code`, `expiration_date`) Values (?)";
  const validationInsertValues = [
    req.body.email,
    req.body.validationCode,
    date,
  ];
  try {
    prog_diary.query(deleatePreValidationCodes, [
      deleatePreValidationCodesValues,
    ]);
  } catch (err) {
    console.log(err);
  }

  try {
    prog_diary.query(ifUserIn, [req.body.email], (err, data) => {
      if (data.length > 0) {
        try {
          prog_diary.query(
            validationInsert,
            [validationInsertValues],
            (err, data) => {
              const mailOptions = {
                from: "recoveryservice404@gmail.com",
                to: req.body.email,
                subject: "Reset your password",
                text: `Use your validation code : ${req.body.validationCode}`,
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  return error;
                } else {
                  res.send(true);
                }
              });
            }
          );
        } catch (err) {
          console.log(err);
        }
      } else {
        res.send(false);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.recoveryPassword = (req, res) => {
  const sql = `SELECT * FROM recovery_data WHERE email  = ? AND validation_code = ?`;

  try {
    prog_diary.query(
      sql,
      [req.body.email, req.body.validationCode],
      (err, data) => {
        if (Date.now() < parseInt(data[0]?.expiration_date)) {
          if (data.length > 0) {
            res.send(true);
          } else {
            res.send(false);
          }
        } else {
          res.send(false);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports.resetPassword = (req, res) => {
  const sql = `UPDATE users SET password = ? WHERE email = ?`;

  try {
    prog_diary.query(
      sql,
      [md5(req.body.password), req.body.email],
      (err, data) => {
        res.send(true);
      }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports.getProgrammingLanguages = (req, res) => {
  const sql = `SELECT	prog_languages_name FROM prog_languages`;
  try {
    prog_diary.query(sql, (err, data) => {
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
  } catch (err) {
    console.log(err);
  }
};

module.exports.getUsages = (req, res) => {
  const sql = `SELECT usages FROM prog_languages_usages`;

  try {
    prog_diary.query(sql, (err, data) => {
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
  } catch (err) {
    console.log(err);
  }
};

module.exports.getDescription = (req, res) => {
  const sql = `SELECT description FROM prog_languages WHERE prog_languages_name = ?`;
  const values = [req.body.id];

  try {
    prog_diary.query(sql, [values], (err, data) => {
      if (data.length > 0) {
        const description = data[0].description;
        res.send(description);
      } else {
        res.send(false);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getRelatedLanguages = (req, res) => {
  const sql = `SELECT prog_languages.prog_languages_name, prog_languages_usages.description, prog_languages.language_icon
      FROM prog_languages
      INNER JOIN languages_usages
      ON prog_languages.prog_languages_id = languages_usages.prog_languages_id
      INNER JOIN prog_languages_usages
      ON prog_languages_usages.usages_id = languages_usages.usages_id AND prog_languages_usages.usages= ? `;
  const values = [req.body.id];

  try {
    prog_diary.query(sql, [values], (err, data) => {
      if (data.length > 0) {
        let relatedLanguages = [];
        for (i = 0; i < data.length; i++) {
          relatedLanguages.push({
            languageName: data[i].prog_languages_name,
            icon: data[i].language_icon,
          });
        }
        const usageDescription = data[0].description;
        res.send([relatedLanguages, usageDescription]);
      } else {
        res.send(false);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getStatistics = (req, res) => {
  const sql = `SELECT statistic_percentage, statistic_year
      FROM statistics
      WHERE prog_language_name = ?
      GROUP BY statistic_year ASC`;
  const values = [req.body.id];

  if (req.body.token) {
    jwt.verify(req.body.token, "PrOgDiArYsEcReT", (err, decodedToken) => {
      if (err) {
        res.send(false);
      } else {
        try {
          prog_diary.query(sql, [values], (err, data) => {
            if (data.length > 0) {
              const statistics = [];
              for (let i = 0; i < data.length; i++) {
                statistics.push({
                  percentage: data[i].statistic_percentage,
                  year: data[i].statistic_year,
                });
              }
              res.send(statistics);
            } else {
              res.send(false);
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
  } else {
    res.send(false);
  }
};
