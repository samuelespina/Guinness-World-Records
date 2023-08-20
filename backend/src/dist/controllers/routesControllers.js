"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatistics = exports.getRelatedLanguages = exports.getDescription = exports.getUsages = exports.getProgrammingLanguages = exports.resetPassword = exports.recoveryPassword = exports.forgotPassword = exports.login = exports.signup = void 0;
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
var md5 = require("md5");
var nodemailer = require("nodemailer");
var cookieParser = require("cookie-parser");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)(); //ISSUES : con app non ci faccio niente, perchè se lo tolgo crasha?
app.use(express_1.default.json()); //il body della res e della req delle api sono già formattate in json
app.use(cookieParser());
const prog_diary = mysql_1.default.createConnection({
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
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const maxAge = 2 * 24 * 60 * 60;
const createToken = (payload) => {
    //passo il payload da criptare e la chiave
    return jsonwebtoken_1.default.sign({ payload }, "PrOgDiArYsEcReT", { expiresIn: maxAge });
};
/*



CONTROLLERS



*/
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql1 = "INSERT INTO users (`user_name`, `email`, `password`) Values (?)";
    const values1 = [req.body.user_name, req.body.email, md5(req.body.password)];
    const sql2 = `SELECT user_name FROM users WHERE user_name = ? `;
    const sql3 = `SELECT email FROM users WHERE email = ? `;
    let resMessage = "";
    console.log(resMessage);
    prog_diary.query(sql2, [req.body.user_name], (err, data) => {
        if (err)
            return err;
        if (data.length > 0) {
            resMessage = resMessage + "username";
        }
        prog_diary.query(sql3, [req.body.email], (err, data) => {
            if (err)
                return err;
            if (data.length > 0) {
                resMessage = resMessage + "email";
            }
            if (resMessage === "") {
                if (emailRegex.test(req.body.email)) {
                    prog_diary.query(sql1, [values1], (err, data) => {
                        if (err)
                            return err;
                        // creazione del token
                        const token = createToken(req.body.email);
                        res.send({
                            registrationResult: true,
                            emailstatus: true,
                            token: token,
                        });
                    });
                }
                else {
                    res.send({
                        registrationResult: false,
                        emailstatus: false,
                        token: false,
                    });
                }
            }
            else if (resMessage === "usernameemail") {
                res.send({
                    registrationResult: "username already registered",
                    emailstatus: true,
                    token: false,
                });
            }
            else {
                res.send({
                    registrationResult: resMessage,
                    emailstatus: emailRegex.test(req.body.email),
                    token: false,
                });
            }
        });
    });
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    prog_diary.query(sql, [req.body.email, md5(req.body.password)], (err, data) => {
        if (err)
            return err;
        if (data.length > 0) {
            //creazione del token
            const token = createToken(req.body.email);
            res.send(token);
        }
        else {
            res.send(false);
        }
    });
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleatePreValidationCodes = `DELETE FROM recovery_data WHERE email = ? `;
    const deleatePreValidationCodesValues = [req.body.email];
    const ifUserIn = "SELECT email FROM users WHERE email = ?";
    const date = Date.now() + 60000;
    const validationInsert = "INSERT INTO recovery_data (`email`, `validation_code`, `expiration_date`) Values (?)";
    const validationInsertValues = [
        req.body.email,
        req.body.validationCode,
        date,
    ];
    prog_diary.query(deleatePreValidationCodes, [deleatePreValidationCodesValues], (err) => {
        if (err)
            return err;
        prog_diary.query(ifUserIn, [req.body.email], (err, data) => {
            if (err)
                return err;
            if (data.length > 0) {
                prog_diary.query(validationInsert, [validationInsertValues], (err, data) => {
                    if (err)
                        return err;
                    const mailOptions = {
                        from: "recoveryservice404@gmail.com",
                        to: req.body.email,
                        subject: "Reset your password",
                        text: `Use your validation code : ${req.body.validationCode}`,
                    };
                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            return err;
                        }
                        else {
                            res.send(true);
                        }
                    });
                });
            }
            else {
                res.send(false);
            }
        });
    });
});
exports.forgotPassword = forgotPassword;
const recoveryPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `SELECT * FROM recovery_data WHERE email  = ? AND validation_code = ?`;
    prog_diary.query(sql, [req.body.email, req.body.validationCode], (err, data) => {
        var _a;
        if (err)
            return err;
        if (Date.now() < parseInt((_a = data[0]) === null || _a === void 0 ? void 0 : _a.expiration_date)) {
            if (data.length > 0) {
                res.send(true);
            }
            else {
                res.send(false);
            }
        }
        else {
            res.send(false);
        }
    });
});
exports.recoveryPassword = recoveryPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `UPDATE users SET password = ? WHERE email = ?`;
    prog_diary.query(sql, [md5(req.body.password), req.body.email], (err, data) => {
        if (err)
            return err;
        res.send(true);
    });
});
exports.resetPassword = resetPassword;
const getProgrammingLanguages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `SELECT	prog_languages_name FROM prog_languages`;
    prog_diary.query(sql, (err, data) => {
        if (err)
            return err;
        if (data.length > 0) {
            const allLanguages = [];
            for (let i = 0; i < data.length; i++) {
                allLanguages.push(data[i].prog_languages_name);
            }
            res.send(allLanguages);
        }
        else {
            res.send(false);
        }
    });
});
exports.getProgrammingLanguages = getProgrammingLanguages;
const getUsages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `SELECT usages FROM prog_languages_usages`;
    prog_diary.query(sql, (err, data) => {
        if (err)
            return err;
        if (data.length > 0) {
            const usages = [];
            for (let i = 0; i < data.length; i++) {
                usages.push(data[i].usages);
            }
            res.send(usages);
        }
        else {
            res.send(false);
        }
    });
});
exports.getUsages = getUsages;
const getDescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `SELECT description FROM prog_languages WHERE prog_languages_name = ?`;
    const values = [req.body.id];
    prog_diary.query(sql, [values], (err, data) => {
        if (err)
            return err;
        if (data.length > 0) {
            const description = data[0].description;
            res.send(description);
        }
        else {
            res.send(false);
        }
    });
});
exports.getDescription = getDescription;
const getRelatedLanguages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `SELECT prog_languages.prog_languages_name, prog_languages_usages.description, prog_languages.language_icon
      FROM prog_languages
      INNER JOIN languages_usages
      ON prog_languages.prog_languages_id = languages_usages.prog_languages_id
      INNER JOIN prog_languages_usages
      ON prog_languages_usages.usages_id = languages_usages.usages_id AND prog_languages_usages.usages= ? `;
    const values = [req.body.id];
    prog_diary.query(sql, [values], (err, data) => {
        if (err)
            return err;
        if (data.length > 0) {
            let relatedLanguages = [];
            for (let i = 0; i < data.length; i++) {
                relatedLanguages.push({
                    languageName: data[i].prog_languages_name,
                    icon: data[i].language_icon,
                });
            }
            const usageDescription = data[0].description;
            res.send([relatedLanguages, usageDescription]);
        }
        else {
            res.send(false);
        }
    });
});
exports.getRelatedLanguages = getRelatedLanguages;
const getStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `SELECT statistic_percentage, statistic_year
      FROM statistics
      WHERE prog_language_name = ?
      GROUP BY statistic_year ASC`;
    const values = [req.body.id];
    if (req.body.token) {
        jsonwebtoken_1.default.verify(req.body.token, "PrOgDiArYsEcReT", (err, decodedToken) => {
            if (err) {
                res.send(false);
            }
            else {
                prog_diary.query(sql, [values], (err, data) => {
                    if (err)
                        return err;
                    if (data.length > 0) {
                        const statistics = [];
                        for (let i = 0; i < data.length; i++) {
                            statistics.push({
                                percentage: data[i].statistic_percentage,
                                year: data[i].statistic_year,
                            });
                        }
                        res.send(statistics);
                    }
                    else {
                        res.send(false);
                    }
                });
            }
        });
    }
    else {
        res.send(false);
    }
});
exports.getStatistics = getStatistics;
