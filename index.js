// const express = require("express");
import express from "express";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import flash from "express-flash";
import session from "express-session";

const db = new Pool({
  user: "neondb_owner",
  password: "npg_DkJVh4rm2HTf",
  host: "ep-long-shadow-a1xq04j1-pooler.ap-southeast-1.aws.neon.tech",
  port: 5432,
  database: "neondb",
  max: 20,
  ssl: true,
});
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
app.use(flash());
app.use(
  session({
    secret: "Junkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", home);
app.get("/contact", contact);
app.get("/projects", projects);
app.get("/detail", details);
// app.get("/Contactpage/:id", contactpageGet);
app.get("/login", login);
app.get("/register", register);

app.post("/logout", logout);
app.post("/contact", handleContact); //submit the contact form
app.post("/login", handleLogin); //submit the login form
app.post("/register", handleRegister); //submit the register form

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
// function
function home(req, res) {
  // const query = `SELECT * FROM "Contact"`;
  // const result = await db.query(query);

  // console.log(result.rows);
  // console.log(req.session.Authentication);
  if (!req.session.Authentication) {
    return res.render("Homepage");
  }
  const activeUser = {
    name: req.session.Authentication.name,
    email: req.session.Authentication.email,
  };
  res.render("Homepage", { activeUser });

  // console.log(activeUser);
}
function contact(req, res) {
  const phoneNumber = 6287839056763;
  if (!req.session.Authentication) {
    return res.render("login");
  }
  res.render("Contactpage", { phoneNumber });
}
function projects(req, res) {
  if (!req.session.Authentication) {
    return res.render("login");
  }
  res.render("MyProjectpage");
}
function details(req, res) {
  res.render("Detailpage");
}
async function handleContact(req, res) {
  // console.log(req.body);
  // usual standard way of handling the data
  // let contactData = {
  //   fname: req.body.fname,
  //   lname: req.body.lname,
  //   email: req.body.email,
  // };
  // object destructuring to get the values //
  let { fname, lname, email } = req.body;
  // console.log(fname, lname, email);
  let contact = {
    fname,
    lname,
    email,
  };
  // contactData.push(contact);
  // console.log(contactData);
  // console.log("Data received from contact form!");
  // res.redirect("/");
  const query = `INSERT INTO "Contact" ("firstName","lastName","E-mail") VALUES ('${contact.fname}','${contact.lname}', '${contact.email}')`;
  // const query = `SELECT * FROM "Contact"`;
  const result2 = await db.query(query);
  console.log(result2.rows);
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
function login(req, res) {
  res.render("login", { message: req.flash("error") });
}
function register(req, res) {
  res.render("register", { message: req.flash("error") });
}
async function handleLogin(req, res) {
  const { email, password } = req.body;
  const registered = await db.query(
    `SELECT * FROM public."Authentication" WHERE "E_mail" = '${email}'`
  );
  const matching = await bcrypt.compare(password, registered.rows[0].password);
  console.log(matching);
  if (!matching) {
    req.flash("error", "Wrong Password");
    return res.redirect("/login");
  }
  // console.log(email, password);
  req.session.Authentication = {
    name: registered.rows[0].fName,
    email: registered.rows[0].E_mail,
  };
  res.redirect("/");
  // req.session.destroy();
}
async function handleRegister(req, res) {
  let { fname, lname, email, password } = req.body;
  const registered = await db.query(
    `SELECT * FROM public."Authentication" WHERE "E_mail" = '${email}'`
  );
  console.log(registered.rows[0]);
  if (registered.rows[0]) {
    req.flash("error", "Email was already registered");
    return res.redirect("/register");
  }
  const hashPW = await bcrypt.hash(password, 10);
  const query = `INSERT INTO public."Authentication"("fName","lName","E_mail","password") VALUES ('${fname}','${lname}', '${email}', '${hashPW}')`;
  const result = await db.query(query);
  console.log(fname, lname, email, password, hashPW);
  res.redirect("/login");
}
function logout(req, res) {
  req.session.destroy();
  return res.redirect("/");
}
