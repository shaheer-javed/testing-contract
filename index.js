const express = require("express");
const bodyParser = require("body-parser");
const { PDFDocument, rgb } = require("pdf-lib");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Set up home route
app.get("/", (req, res) => {
  res.send("This is the homepage");
});

app.post("/", (req, res) => {
  console.log(req.body);
  //   res.send("POST request to the homepage");
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`Success! Your application is running on  localhost${port}.`);
});
