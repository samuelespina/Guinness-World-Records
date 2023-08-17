const express = require("express");
const cors = require("cors"); //sicurezza sulle api create
const routes = require("./routes/authRoutes");

const app = express();
app.use(cors()); //ISSUES : perchè se lo tolgo non funziona?
app.use(express.json()); //il body della res e della req delle api sono già formattate in json

app.use(routes);

app.listen(8081);
