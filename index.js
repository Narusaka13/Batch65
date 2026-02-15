// const express = require("express");
import express from "express";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import flash from "express-flash";
import session from "express-session";
import multer from "multer";
import path from "path";
import { log } from "console";

//Global Variables
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
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "./src/assets/Uploads/Pic");//for user profile picture
    // cb(null, "./src/assets/Uploads/projects/temp"); //for temporaty project image
    cb(null, "./src/assets/Uploads/projects/db"); //for database project image
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + Date.now() + path.extname(file.originalname)
      //  '-' + uniqueSuffix
    );
  },
});
const upload = multer({ storage: storage });
let projectssaved = [];

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

//Routes
app.get("/", home);
app.get("/contact", contact);
app.get("/projects", projects);
app.get("/detail/:id", details);
app.get("/login", login);
app.get("/register", register);
app.post("/logout", logout);
app.post("/contact", handleContact); //submit the contact form
app.post("/login", handleLogin); //submit the login form
app.post("/register", upload.single("proPic"), handleRegister); //submit the register form
app.post("/projects", upload.single("image"), handleProjects); //submit the project form
app.post("/projects/delete/:id", deleteProject);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// function
async function home(req, res) {
  // console.log(req.session.Authentication);
  if (!req.session.Authentication) {
    return res.render("Homepage");
  }
  const query = `SELECT "proFile" FROM "Authentication" WHERE "E_mail" = '${req.session.Authentication.email}'`;
  const result = await db.query(query);
  const activeUser = {
    name: req.session.Authentication.name,
    email: req.session.Authentication.email,
    profile: result.rows[0].proFile,
  };
  console.log(result.rows);
  res.render("Homepage", { activeUser });

  // console.log(activeUser);
}
function contact(req, res) {
  const phoneNumber = 6287839056763;
  // if (!req.session.Authentication) {
  //   return res.render("login");
  // }
  res.render("Contactpage", { phoneNumber });
}
async function projects(req, res) {
  const query = `
  SELECT 
  p.id,
  p.project_name as projectname,
  p.description as desc,
  p.start_date as start,
  p.end_date as end,
  p.image as image,
  COALESCE(
    array_agg(t.name) FILTER (WHERE t.name IS NOT NULL), 
    ARRAY[]::VARCHAR[]
  ) as technologies
FROM projects p
LEFT JOIN project_technologies pt ON p.id = pt.project_id
LEFT JOIN technologies t ON pt.technology_id = t.id
GROUP BY p.id
ORDER BY p.created_at DESC
    `;
  const result = await db.query(query);
  const projects = result.rows;
  // Format dates for display
  const formattedProjects = projects.map((project) => ({
    ...project,
    // Format dates to YYYY-MM-DD if they're Date objects
    start: project.start
      ? new Date(project.start).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "",
    end: project.end
      ? new Date(project.end).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "",
  }));
  res.render("MyProjectpage", {
    projects: formattedProjects,
    message: req.flash("error"),
    success: req.flash("success"),
  });
}
async function details(req, res) {
  const projectId = parseInt(req.params.id);
  if (!projectId) {
    req.flash("error", "No project ID provided");
    return res.redirect("/projects");
  }
  const query = `
  SELECT 
  p.id,
  p.project_name as projectname,
  p.description as desc,
  p.start_date as start,
  p.end_date as end,
  p.image as image,
  COALESCE(
    array_agg(t.name) FILTER (WHERE t.name IS NOT NULL), 
    ARRAY[]::VARCHAR[]
  ) as technologies
FROM projects p
LEFT JOIN project_technologies pt ON p.id = pt.project_id
LEFT JOIN technologies t ON pt.technology_id = t.id
WHERE p.id = $1
GROUP BY p.id
    `;
  const result = await db.query(query, [projectId]);
  if (result.rows.length === 0) {
    req.flash("error", "Project not found");
    return res.redirect("/projects");
  }
  const project = result.rows[0];
  // Format dates for display

  const formattedProjects = {
    ...project,
    // Format dates to YYYY-MM-DD if they're Date objects
    start: project.start
      ? new Date(project.start).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "",
    end: project.end
      ? new Date(project.end).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "",
  };

  // Calculate duration
  const startDate = new Date(project.start);
  const endDate = new Date(project.end);
  const durationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  res.render("Detailpage", {
    project: {
      ...formattedProjects,
      duration: durationDays,
    },
  });
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
  // return console.log(req.file.filename);
  const registered = await db.query(
    `SELECT * FROM public."Authentication" WHERE "E_mail" = '${email}'`
  );
  console.log(registered.rows[0]);
  if (registered.rows[0]) {
    req.flash("error", "Email was already registered");
    return res.redirect("/register");
  }
  const hashPW = await bcrypt.hash(password, 10);
  const query = `INSERT INTO public."Authentication"("fName","lName","E_mail","password", "proFile") VALUES ('${fname}','${lname}', '${email}', '${hashPW}', '${req.file.filename}')`;
  const result = await db.query(query);
  console.log(fname, lname, email, password, hashPW);
  res.redirect("/login");
}
function logout(req, res) {
  req.session.destroy();
  return res.redirect("/");
}
async function handleProjects(req, res) {
  let { projectname, start, end, desc, technologies } = req.body;
  if (!projectname || !start || !end || !desc) {
    req.flash("error", "Please fill all required fields");
    return res.redirect("/projects");
  }
  // Handle technologies array
  let techArray = [];
  if (technologies) {
    techArray = Array.isArray(technologies) ? technologies : [technologies];
  }
  // Handle image filename with default option
  let imagefile = null;
  if (req.file) {
    imagefile = req.file.filename;
  } else {
    imagefile = "1.png";
  }
  const projectid = Date.now();
  const newProject = {
    id: projectid,
    projectname,
    start,
    end,
    desc,
    technologies: techArray,
    image: imagefile,
  };
  const techValues = techArray.map((tech) => `'${tech}'`).join(", ");
  const checkTechQuery = `SELECT id,name FROM technologies WHERE name IN (${techValues})`;
  const checkTechResult = await db.query(checkTechQuery);
  const techMap = {};
  checkTechResult.rows.forEach((row) => {
    techMap[row.name] = row.id;
  });
  const query = `INSERT INTO public.projects("id","project_name" ,"start_date" ,"end_date","description", "image") VALUES ('${projectid}','${projectname}', '${start}', '${end}', '${desc}', '${imagefile}')`;
  const result = await db.query(query);
  for (const tech of techArray) {
    const techid = techMap[tech];
    const linkQuery = `INSERT INTO project_technologies (project_id, technology_id) VALUES (${projectid}, ${techid})`;
    await db.query(linkQuery);
  }
  res.redirect("/projects");
}
function deleteProject(req, res) {
  const projectId = parseInt(req.params.id);
  const projectIndex = projectssaved.findIndex((p) => p.id === projectId);
  if (projectIndex === -1) {
    req.flash("error", "Project not found");
    return res.redirect("/projects");
  }
  //Remove project from array
  projectssaved.splice(projectIndex, 1);
  req.flash("success", "Project deleted successfully");
  res.redirect("/projects");
}
