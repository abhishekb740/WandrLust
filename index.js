const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const relation = require("./Models/sqlite");
const nodemailer = require('nodemailer');
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
};

app.get("/", (req, res) => {
  res.render("home", {
    name: user.name.substring(0, user.name.indexOf(" ")) ? user.name.substring(0, user.name.indexOf(" ")) : user.name,
    isLoggedIn: isLoggedIn,
    email: user.email,
    username: user.username,
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    name: user.name.substring(0, user.name.indexOf(" ")) ? user.name.substring(0, user.name.indexOf(" ")) : user.name,
    isLoggedIn: isLoggedIn,
    email: user.email,
    username: user.username,
  });
});

app.get("/test", (req, res) => {
  res.render("test");
});

app.get("/faq", (req, res) => {
  res.render("faq", {
    name: user.name.substring(0, user.name.indexOf(" ")) ? user.name.substring(0, user.name.indexOf(" ")) : user.name,
    isLoggedIn: isLoggedIn,
    email: user.email,
    username: user.username,
  });
});

app.post("/sendMail", (req, res) => {
  const {name, email, message} = req.body;
  console.log(name, email, message);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vaibhav.pandey0806@gmail.com",
      pass: "farimahhzsrpxeff"
    }
  })

  let mailOptions = {
    from: "vaibhav.pandey0806@gmail.com",
    to: email,
    subject: "Wandrlust | Query Received",
    text: `Name: ${name}
           mail: ${email}, 
           description:${message}`,
  }
  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      console.log("Mail not sent.", err)
    }
    else {
      console.log("Success, email has been sent, and your account has been verified!!", success)
    }
  })
  res.redirect('/contact')
});

app.get("/budget", (req, res) => {
  if (isLoggedIn) {
    res.render("budget", {
      name: user.name.substring(0, user.name.indexOf(" ")) ? user.name.substring(0, user.name.indexOf(" ")) : user.name,
      isLoggedIn: isLoggedIn,
      email: user.email,
      username: user.username,
    });
  } else {
    res.redirect("/");
  }
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    name: user.name.substring(0, user.name.indexOf(" ")) ? user.name.substring(0, user.name.indexOf(" ")) : user.name,
    isLoggedIn: isLoggedIn,
    email: user.email,
    username: user.username,
  });
});

app.get("/login", (req, res) => {
  isLoggedIn = false;
  res.render("login");
});

app.get("/profile", (req, res) => {
  if (isLoggedIn) {
    res.render("profile", {
      name: user.name,
      isLoggedIn: isLoggedIn,
      email: user.email,
      username: user.username,
      phonenumber: user.phonenumber,
      age: user.age,
    });
  } else {
    res.render("home", {
      name: user.name.substring(0, user.name.indexOf(" ")) ? user.name.substring(0, user.name.indexOf(" ")) : user.name,
      isLoggedIn: isLoggedIn,
      email: user.email,
      username: user.username,
    });
  }
});

app.get("/post",(req,res)=>{
  if(isLoggedIn){
    res.render("post", {
      name: user.name.substring(0, user.name.indexOf(" ")) ? user.name.substring(0, user.name.indexOf(" ")) : user.name,
      isLoggedIn: isLoggedIn,
      email: user.email,
      username: user.username,
    })
  }
  else{
    res.redirect("/")
  }
})

app.get("/feed",(req,res)=>{
  if(isLoggedIn){
    res.render("feed",{
      name: user.name.substring(0, user.name.indexOf(" ")) ? user.name.substring(0, user.name.indexOf(" ")) : user.name,
      isLoggedIn: isLoggedIn,
      email: user.email,
      username: user.username,
    })
  }
  else{
    res.redirect("/")
  }
})

app.get("/locations", (req, res) => {
  if (isLoggedIn) {
    res.render("locations", {
      name: user.name.substring(0, user.name.indexOf(" ")) ? user.name.substring(0, user.name.indexOf(" ")) : user.name,
      isLoggedIn: isLoggedIn,
      email: user.email,
      username: user.username,
    });
  } else {
    res.redirect("/")
  }
});

let isLoggedIn = false;

app.post("/logout", (req, res) => {
  isLoggedIn = false;
  console.log(isLoggedIn);
  res.redirect("/");
});


app.post("/signin", async (req, res) => {
  console.log("SignIn");
  console.log(req.body);
  let username = req.body.username;
  let password = req.body.password;
  db.get(`Select * from account where username = ?`, [username], (err, row) => {
    if (err) {
      console.log(err.message);
    }
    if (row) {
      let pass_correct = row.password;
      if (pass_correct == password) {
        isLoggedIn = true;
        user.name = row.name;
        user.email = row.email;
        user.phonenumber = row.phonenumber;
        user.username = row.username;
        user.password = row.password;
        user.age = row.age;
        user.gender = row.gender;
        console.log(user);
        res.redirect("/");
      } else {
        res.send("Incorrect Password!");
      }
    }
  });
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
    user.name = req.body.name;
    user.email = req.body.email;
    user.phonenumber = req.body.phonenumber;
    user.username = req.body.username;
    user.password = req.body.password;
    user.age = req.body.age;
    user.gender = req.body.gender;
    console.log(user);
  }
  isLoggedIn = true;
  res.redirect("/login");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Listening on port ", PORT);
});
