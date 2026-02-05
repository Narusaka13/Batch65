// const express = require("express");
import express from "express";
const app = express();
const port = "3000";

let contactData = [];
let homeData = [
  {
    id: 1,
    title: "project1",
  },
  {
    id: 2,
    title: "project2",
  },
  {
    id: 3,
    title: "project3",
  },
  {
    id: 4,
    title: "project4",
  },
];

app.set("view engine", "hbs");
app.set("views", "src/views");
app.use("/assets", express.static("src/assets"));
app.use(express.urlencoded({ extended: false }));

app.get("/", home);
app.get("/contact", (req, res) => {
  const phoneNumber = 6287839056763;
  res.render("Contactpage", { phoneNumber });
}); ///renders the contact page
app.get("/projects", projects);
app.get("/detail", details);
app.get("/Contactpage/:id", contactpageGet);

app.post("/contact", handleContact); //submit the contact form

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
// function
function home(req, res) {
  res.render("Homepage", { homeData });
}
function projects(req, res) {
  res.render("MyProjectpage");
}
function details(req, res) {
  res.render("Detailpage");
}
function handleContact(req, res) {
  // console.log(req.body);
  // usual standard way of handling the data
  // let contactData = {
  //   fname: req.body.fname,
  //   lname: req.body.lname,
  //   email: req.body.email,
  // };
  // object destructuring to get the values //
  let { fname, lname, email } = req.body;
  console.log(fname, lname, email);
  let contact = {
    fname,
    lname,
    email,
  };
  contactData.push(contact);
  console.log(contactData);
  console.log("Data received from contact form!");
  res.redirect("/");
}
function contactpageGet(req, res) {
  // console.log(req.params.id);
  let { id } = req.params;

  // // res.render("Contactpage", { phoneNumber: req.params.id });
  let result = homeData.find((element) => element.id == id);
  console.log(result);
  console.log(id);
  res.render("Contactpage", { result });
  // // req.send(homeData[id - 1]);
}
