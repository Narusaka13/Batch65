import express from "express";

const app = express();
const port = "3339";

app.set("view engine", "hbs");
app.set("views", "src/views");
app.use("/assets", express.static("src/assets"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/", home);

function home(req, res) {
  res.render("portofolio");
}
