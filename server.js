const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.use(cors());

app.use(express.json());

app.use("/", require("./routes/routes.js"));

var port = process.env.PORT || 5000;
app.listen(port);
