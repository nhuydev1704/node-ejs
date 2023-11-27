require("dotenv/config");
const express = require("express");
// const methodOverride = require("method-override");
const { checkSession } = require("./app/utils");
// const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;
// app.use(
//   session({
//     secret: "your_secret_key", // Thay thế bằng chuỗi bí mật thực tế
//     resave: false,
//     saveUninitialized: true,
//   })
// );

app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", "app/views");
app.use(express.static("app/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method", { methods: ["POST", "GET"] }));
// app.use(
//   methodOverride(function (req, res) {
//     if (req.body && typeof req.body === "object" && "_method" in req.body) {
//       var method = req.body._method;
//       delete req.body._method;
//       return method;
//     }
//   })
// );
// app.use(
//   "/tinymce",
//   express.static(path.join(__dirname, "node_modules", "tinymce"))
// );

app.get("/", checkSession, (req, res) => {
  res.render("index");
});
app.get("/500", (req, res) => {
  res.render("err");
});
app.get("/404", (req, res) => {
  res.render("404");
});

require("./app/routers")(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
