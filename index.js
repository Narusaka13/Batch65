// const express = require("express");
import express from "express";
const app = express();
const port = "3000";

app.set("view engine", "hbs");
app.set("views", "src/views");
app.use("/assets", express.static("src/assets"));

app.get("/", home);
app.get("/contact", (req, res) => {
  const phoneNumber = 6287839056763;
  res.render("Contactpage", { phoneNumber });
});
app.get("/projects", projects);
app.get("/detail", details);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
// function
function home(req, res) {
  res.render("Homepage");
}
function projects(req, res) {
  res.render("MyProjectpage");
}
function details(req, res) {
  res.render("Detailpage");
}
