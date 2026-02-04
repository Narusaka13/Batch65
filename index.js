// const express = require("express");
import express from "express";
const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", "src/views");
app.use("/assets", express.static("src/assets"));
app.get("/", (req, res) => {
  //   res.send("Hello World!!!Narusaka here!!!");
  res.render("homepage");
});
app.get("/contact", (req, res) => {
  res.render("Contactpage");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
