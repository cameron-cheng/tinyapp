const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const helpers = require('./helpers.js')

app.use(cookieSession({
  name: 'session',
  secret: 'AKTi6ZrOK07q6mosGZJigZjM+GCODRbsTs9n85ZraBZXmDu3QuHCOlBYa7U='
}))
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

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
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: 'userRandomID' },
  "9sm5xK": { longURL:  "http://www.google.com", userID: 'userRandomID' }
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

//Check if email submitted is an empty string or exists in database
function existingUser(email) {
  if(email === ""){
    return false;
  } 
  for(const id in users){
    if(users[id].email === email){
      return true;
    }
  }
  return false;
}; 

// Check login function
const checkLogin = function(email, password) {
  for (const id in users) {
    if(users[id].email === email) {
      if (bcrypt.compareSync(password, users[id].password)) {
        return id;
      }
    }
  }
  return;
}

//Function for displaying URLs when logged in
const urlsForUser = function(id) {
  const urls = {};
  for (key in urlDatabase) {
    if (id === urlDatabase[key].userID) {
      urls[key] = urlDatabase[key]
    }
  } 
  return urls; 
}

//Read user ID and attach userid to the req.user
app.use((req, res, next) => {
  const userID = req.session.user_id;
  const user = users[userID];
  req.user = user;
  next(); 
})

app.get("/", (req, res) => {
  res.send("Hello!")
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

//Render URLs page aka. urls_index.ejs
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  
  if(user) {
    let templateVars = {user, urls: urlsForUser(userID) };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/urls/login")
  }
});

//Render New URLs Page
app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  let templateVars = {user, urls: urlDatabase }
  
  if (!user)  {
    res.redirect('/urls/login');
  } else {
    res.render("urls_new", templateVars);
  } 
});

//Render Registration Page
app.get("/urls/register", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  let templateVars = {user}
  res.render("urls_register", templateVars);
});

//Render Login Page
app.get("/urls/login", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  let templateVars = {user}
  res.render("urls_login", templateVars);
})

//Generate Random ID for URL and User & Create new URL
app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  urlDatabase[generateRandomString(6)] = { 
    longURL: req.body.longURL,
    userID
  };
  res.redirect("/urls");
});


//Login Cookie Route - Set Cookie
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const randomID = checkLogin(email, password)
  if (randomID) {
    req.session.user_id = randomID;
    res.redirect('/urls/');
  } else {
    res.send(403).send('Unable to Login');
  }
})

//Logout Cookie Route
app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect('/urls/');
})

//Post User Registration
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (existingUser(email)) {
    res.status(400).send("Existing User")
  } else{
    let randomID = generateRandomString(6)
    users[randomID] = { randomID, email, password: hashedPassword };
    req.session.user_id = randomID;
    res.redirect("/urls");
  };    
})

//Delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.user_id;
  const urlObj = urlDatabase[req.params.shortURL];
  
  if (urlObj.userID === userID) {
  delete urlDatabase[shortURL];
  res.redirect("/urls"); 
  } else {
    res.redirect('/urls/register');
  }
});

app.get("/urls/:shortURL", (req, res) => { 
const user = users[userID];
let templateVars = { user, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]}
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls/:id/", (req, res) => {
  const userID = req.session.user_id;
  const urlObj = urlDatabase[req.params.id];

  if (urlObj.userID === userID) {
    const shortURL = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
  } else {
    res.redirect('/urls/register')
  }
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
