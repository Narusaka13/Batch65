// const express = require("express");
import express from "express";
const app = express();
const port = "3000";

app.set("view engine", "hbs");
app.set("views", "src/views");
app.use("/assets", express.static("src/assets"));
// app.get("/", (req, res) => {
//   //   res.send("Hello World!!!Narusaka here!!!");
//   res.render("homepage");
// });
app.get("/", home);
app.get("/contact", (req, res) => {
  const phoneNumber = 6287839056763;
  res.render("Contactpage", { phoneNumber });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
// function
function home(req, res) {
  res.render("Homepage");
}
