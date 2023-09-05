import express, { Application, Request, Response } from "express";
import mysql from "mysql";
var md5 = require("md5");
var nodemailer = require("nodemailer");
var cookieParser = require("cookie-parser");
import jwt from "jsonwebtoken";
const app: Application = express(); //ISSUES : con app non ci faccio niente, perchè se lo tolgo crasha?
app.use(express.json()); //il body della res e della req delle api sono già formattate in json
app.use(cookieParser());

export class Controllers {
  public prog_diary = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "prog_diary",
  }); //ISSUES : se le funzioni vengono messe dentro i routes e tutti i routes vengono usati in server .js , perchè vuole la connessione al db e md5 anche qui?

  public transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "recoveryserviceprd@gmail.com",
      pass: "bzxbosgxxmswtjrl",
    },
  }); //ISSUES :  nello stesso modo della connessione con il db, se metto il transporter in server.js non va, se lo metto qui va

  public emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  public maxAge = 2 * 24 * 60 * 60;

  public createToken(payload: string) {
    //passo il payload da criptare e la chiave
    return jwt.sign({ payload }, "PrOgDiArYsEcReT", { expiresIn: this.maxAge });
  }

  public async signup(req: Request, res: Response) {
    const sql1 =
      "INSERT INTO users (`user_name`, `email`, `password`) Values (?)";
    const values1 = [
      req.body.user_name,
      req.body.email,
      md5(req.body.password),
    ];
    const sql2 = `SELECT user_name FROM users WHERE user_name = ? `;
    const sql3 = `SELECT email FROM users WHERE email = ? `;

    let resMessage = "";

    this.prog_diary.query(sql2, [req.body.user_name], (err, data) => {
      if (err) return err;
      if (data.length > 0) {
        resMessage = resMessage + "username";
      }
      this.prog_diary.query(sql3, [req.body.email], (err, data) => {
        if (err) return err;
        if (data.length > 0) {
          resMessage = resMessage + "email";
        }
        if (resMessage === "") {
          if (this.emailRegex.test(req.body.email)) {
            this.prog_diary.query(sql1, [values1], (err, data) => {
              if (err) return err;
              // creazione del token
              const token = this.createToken(req.body.email);

              res.send({
                registrationResult: true,
                emailstatus: true,
                token: token,
                userName: req.body.user_name,
              });
            });
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
            emailstatus: this.emailRegex.test(req.body.email),
            token: false,
          });
        }
      });
    });
  }

  public login(req: Request, res: Response) {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    const findUsername = "SELECT user_name FROM users WHERE email = ?";
    this.prog_diary.query(
      sql,
      [req.body.email, md5(req.body.password)],
      (err, data) => {
        if (err) return err;
        if (data.length > 0) {
          //creazione del token
          const token = this.createToken(req.body.email);

          this.prog_diary.query(findUsername, [req.body.email], (err, data) => {
            res.send({
              token: token,
              username: data[0].user_name,
              registrationResult: true,
            });
          });
        } else {
          res.send({ registrationResult: "loginIssues" });
        }
      }
    );
  }

  public forgotPassword(req: Request, res: Response) {
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

    this.prog_diary.query(
      deleatePreValidationCodes,
      [deleatePreValidationCodesValues],
      (err) => {
        if (err) return err;
        this.prog_diary.query(ifUserIn, [req.body.email], (err, data) => {
          if (err) return err;
          if (data.length > 0) {
            this.prog_diary.query(
              validationInsert,
              [validationInsertValues],
              (err, data) => {
                if (err) return err;

                res.send(true);

                const mailOptions = {
                  from: "recoveryservice404@gmail.com",
                  to: req.body.email,
                  subject: "Reset your password",
                  text: `Use your validation code : ${req.body.validationCode}`,
                };

                this.transporter.sendMail(
                  mailOptions,
                  function (err: Error, info: any) {
                    if (err) {
                      return err;
                    }
                  }
                );
              }
            );
          } else {
            res.send({ registrationResult: "email not found" });
          }
        });
      }
    );
  }

  public recoveryPassword(req: Request, res: Response) {
    const sql = `SELECT * FROM recovery_data WHERE email  = ? AND validation_code = ?`;

    this.prog_diary.query(
      sql,
      [req.body.email, req.body.validationCode],
      (err, data) => {
        if (err) return err;
        if (Date.now() < parseInt(data[0]?.expiration_date)) {
          if (data.length > 0) {
            res.send(true);
          } else {
            res.send({ registrationResult: "secret code expired" });
          }
        } else {
          res.send({ registrationResult: "secret code doesn't match" });
        }
      }
    );
  }

  public resetPassword(req: Request, res: Response) {
    const isIn = `SELECT email FROM users WHERE email = ?`;
    const update = `UPDATE users SET password = ? WHERE email = ?`;

    this.prog_diary.query(isIn, [req.body.email], (err, data) => {
      if (err) console.log(err);
      if (data.length > 0) {
        this.prog_diary.query(
          update,
          [md5(req.body.password), req.body.email],
          (err, data) => {
            if (err) return err;
            res.send(true);
          }
        );
      } else {
        res.send(false);
      }
    });
  }

  public getProgrammingLanguages(req: Request, res: Response) {
    const sql = `SELECT	prog_languages_name FROM prog_languages`;

    this.prog_diary.query(sql, (err, data) => {
      if (err) return err;
      if (data.length > 0) {
        const allLanguages = [];
        for (let i: number = 0; i < data.length; i++) {
          allLanguages.push(data[i].prog_languages_name);
        }
        res.send(allLanguages);
      } else {
        res.send(false);
      }
    });
  }

  public getUsages(req: Request, res: Response) {
    const sql = `SELECT usages FROM prog_languages_usages`;

    this.prog_diary.query(sql, (err, data) => {
      if (err) return err;
      if (data.length > 0) {
        const usages = [];

        for (let i: number = 0; i < data.length; i++) {
          usages.push(data[i].usages);
        }
        res.send(usages);
      } else {
        res.send(false);
      }
    });
  }

  public getDescription(req: Request, res: Response) {
    const sql = `SELECT description FROM prog_languages WHERE prog_languages_name = ?`;
    const values = [req.body.id];

    this.prog_diary.query(sql, [values], (err, data) => {
      if (err) return err;
      if (data.length > 0) {
        const description = data[0].description;
        res.send(description);
      } else {
        res.send(false);
      }
    });
  }

  public getRelatedLanguages(req: Request, res: Response) {
    const sql = `SELECT prog_languages.prog_languages_name, prog_languages_usages.description, prog_languages.language_icon
        FROM prog_languages
        INNER JOIN languages_usages
        ON prog_languages.prog_languages_id = languages_usages.prog_languages_id
        INNER JOIN prog_languages_usages
        ON prog_languages_usages.usages_id = languages_usages.usages_id AND prog_languages_usages.usages= ? `;
    const values = [req.body.id];

    this.prog_diary.query(sql, [values], (err, data) => {
      if (err) return err;
      if (data.length > 0) {
        let relatedLanguages = [];
        for (let i: number = 0; i < data.length; i++) {
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
  }

  public getStatistics(req: Request, res: Response) {
    const sql = `SELECT statistic_percentage, statistic_year
        FROM statistics
        WHERE prog_language_name = ?
        GROUP BY statistic_year ASC`;
    const values = [req.body.id];

    if (req.body.token) {
      jwt.verify(
        req.body.token,
        "PrOgDiArYsEcReT",
        (err: any, decodedToken: any) => {
          if (err) {
            res.send(false);
          } else {
            this.prog_diary.query(sql, [values], (err, data) => {
              if (err) return err;
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
          }
        }
      );
    } else {
      res.send(false);
    }
  }
}
