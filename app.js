const express = require("express");

const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const router = require('./router')


const app = express();

dotenv.config();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/', router);

app.listen(process.env.PORT, function() {
  console.log(`Server started on ${process.env.PORT}`)
});
