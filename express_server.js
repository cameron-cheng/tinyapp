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
  let templateVars = { username: req.cookies.username, urls: urlDatabase };
  console.log(templateVars);
  res.render("urls_index", templateVars);
});

//Get New URLs Page
app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies.username, urls: urlDatabase }
  res.render("urls_new", templateVars);
});

//Get Registration Page
app.get("/urls/register", (req, res) => {
  let templateVars = {username: ''};
  res.render("urls_register", templateVars)
});

//Runs random string generator for shortURL
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

// //Post User Registration
app.post("/register", (req, res) => {
  let randomID = generateRandomString(6)
  users[randomID] = {
    id: randomID, 
    // email: 
    // password: 
  };
  res.cookie("user_id", randomID);
  console.log('users object', users[randomID]);
  res.redirect('/urls');
})

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log('urlDatabase[shortURL]', urlDatabase[shortURL]);
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => { // /users/:username/:post => /users/kurt/something => { params: {username: kurt, post: something} }
  let templateVars = { username: req.cookies.username, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] }
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
