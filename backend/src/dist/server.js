"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require("cors"); //sicurezza sulle api create
const routes = require("./routes/authRoutes");
const app = (0, express_1.default)();
app.use(cors()); //ISSUES &&&&& : perchè se lo tolgo non funziona? far partire una api da una sorgente diversa rispetto a quella di trigger
app.use(express_1.default.json()); //il body della res e della req delle api sono già formattate in json
app.use(routes);
app.listen(8081, () => {
    console.log("server is listening");
});
