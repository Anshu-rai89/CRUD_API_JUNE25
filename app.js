const express = require("express");
const app = express();

app.get("/hello", (req, res) => {
  return res.status(200).json({ msg: "Hello world" });
});

app.use(express.json());
// /posts GET

app.use("/", require("./routes"));

module.exports = app;