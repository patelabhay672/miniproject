const express = require("express");
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/profile",isLoggedIn, (req, res) => {
  console.log(req.user)
  res.send("Yesh you got it");
});

app.post("/register", async (req, res) => {
  let { email, password, username, age, name } = req.body;
  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("user already register");

  bcrypt.genSalt(10, (err, salt) => {
    console.log(salt);
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await userModel.create({
        username,
        email,
        age,
        name,
        password: hash,
      });
      let token = jwt.sign({ email: email, userid: user._id }, "abhi");
      res.cookie("token", token);
      res.send("Registered");
    });
  });
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) return res.status(500).send("Something went wrong");

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
       let token = jwt.sign({ email: email, userid: user._id }, "abhi");
      res.cookie("token", token);
      res.status(200).send("you can login");
    }
    else res.redirect("/login");
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

function isLoggedIn(req, res, next) {
  if (!req.cookies.token) return res.send("You must be logged in");

  try {
    let data = jwt.verify(req.cookies.token, "abhi");
    req.user = data;
    next();
  } catch (err) {
    return res.send("Invalid token");
  }
}


app.listen(3000);
