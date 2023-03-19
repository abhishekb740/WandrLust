const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const relation = require("./Models/sqlite");
const app = express();
const db = relation.connect();
relation.createTable(db);

app.use(express.static(path.join(__dirname, "public")));
var PORT = process.env.PORT || 6969;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

let user = {
  name: "",
  email: "",
  phonenumber: 0,
  username: "",
  password: "",
  age: 0,
  gender: "",
}

app.get("/", (req, res) => {
  if(isLoggedIn){
    res.render("home");
  }
  else{
    res.redirect("/login")
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/test", (req, res) => {
  res.render("test");
});

app.get("/login", (req, res) => {
  res.render("login");
});

//   app.get("/signup", (req, res) => {
//     res.render("signup");
//   });

let isLoggedIn = false

app.post("/",async(req,res)=>{
  if(isLoggedIn){

  }
})

app.post("/signin", async (req, res) => {
  console.log("SignIn");
  console.log(req.body);
  let username = req.body.username;
  let password = req.body.password;
    db.get(`Select * from account where username = ?`,[username],(err,row)=>{
      if(err){
        console.log(err.message);
      }
      if(row){
        let pass_correct = row.password
        if(pass_correct == password){
          isLoggedIn = true;
          res.redirect("/")
        }
        else{
          res.send("Incorrect Password!")
        }
      }
    })
});

app.post("/signup", async (req, res) => {
  console.log("Signup");
  console.log(req.body);
  let name = req.body.name;
  let email = req.body.email;
  let phonenumber = req.body.phonenumber;
  let username = req.body.username;
  let password = req.body.password;
  let age = req.body.age;
  let gender = req.body.gender ? req.body.gender : "";

  let exist;
  const checkAccountIfExists = (username) => {
    db.get(
      `SELECT * FROM account WHERE username = ?`,
      [username],
      (err, row) => {
        if (err) {
          console.error(err.message);
        }
        exist = row;
        return exist;
      }
    );
  };
  exist = await checkAccountIfExists(username);
  console.log(exist);

  if (exist) {
    res.send("Account Already Exists!!");
  } else if (!exist) {
    db.run(
      `insert into account values ("${name}","${email}",${phonenumber},"${username}","${password}",${age},"${gender}")`
    );
  }
  res.redirect("/");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Listening on port ", PORT);
});
