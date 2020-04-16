const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//Check if email submitted is an empty string or exists in database
function existingUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  if(email === "" && password === ""){
    return false;
  } 
  for(const id in users){
    if(users[id].email === email){
      return false
    }
  }
  return true;
}; 

app.get("/", (req, res) => {
  res.send("Hello!")
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

//Get My URLs page aka. urls_index.ejs
app.get("/urls", (req, res) => {
  const userID = req.cookies.user_id;
  const user = users[userID];
  let templateVars = {user, urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//Get New URLs Page
app.get("/urls/new", (req, res) => {
  const userID = req.cookies.user_id;
  const user = users[userID];
  let templateVars = {user, urls: urlDatabase }
  res.render("urls_new", templateVars);
});

//Get Registration Page
app.get("/urls/register", (req, res) => {
  const userID = req.cookies.user_id;
  const user = users[userID];
  let templateVars = {user}
  res.render("urls_register", templateVars)
});

//Runs random string generator for shortURL & randomID
app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString(6)] = req.body.longURL;
  res.redirect("/urls");
});

//Login Cookie Route - Set Cookie
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect('/urls/');
})

//Logout Cookie Route
app.post("/logout", (req, res) => {
  res.clearCookie("username", req.body.username)
  res.redirect('/urls/');
})

//Post User Registration
app.post("/register", (req, res) => {
  if (existingUser(req, res)) {
    const email = req.body.email;
    const password = req.body.password;
    let randomID = generateRandomString(6)
    users[randomID] = { randomID, email, password };
    res.cookie("user_id", randomID);
    res.redirect("/urls");
  } else{
  res.status(400).send("error")
  };
})

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log('urlDatabase[shortURL]', urlDatabase[shortURL]);
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => { // /users/:username/:post => /users/kurt/something => { params: {username: kurt, post: something} }
const userID = req.cookies.user_id;
const user = users[userID];
let templateVars = { user, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] }
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls/:id/", (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });

// app.get("/fetch", (req, res) => {
//   res.send(`a =${a}`);
// });
