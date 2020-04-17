const getUserByEmail = function(email, database) {
  for (let key in database) {
    let user = database[key];
    if (user.email === email) {
      return user;
    }
  }
  return false;
};

//Function for displaying URLs when logged in
const urlsForUser = function(id, urlDatabase) {
  const urls = {};
  for (key in urlDatabase) {
    if (id === urlDatabase[key].userID) {
      urls[key] = urlDatabase[key]
    }
  } 
  return urls; 
}


module.exports = { getUserByEmail, urlsForUser }