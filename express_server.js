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

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.get("/urls", (req, res) => {
  let templateVars = { username: req.cookies.username, urls: urlDatabase };
  console.log(templateVars);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", { username: ''});
});

//Get Registration Page
app.get("/urls/register", (req, res) => {
  let templateVars = {username: ''};
  res.render("urls_register", templateVars)
});


app.get("/", (req, res) => {
  res.send("Hello!")
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  urlDatabase[generateRandomString(6)] = req.body.longURL;
  res.redirect("/urls");
});

//Login Cookie Route
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect('/urls/');
})

//Logout Cookie Route
app.post("/logout", (req, res) => {
  res.clearCookie("username", req.body.username)
  res.redirect('/urls/');
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
