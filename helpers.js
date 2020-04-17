const getUserByEmail = function(email, database) {
  for (let key in database) {
    let user = database[key]
    if (users.email === email) {
      return users[user];
    }
};





module.exports = getUserByEmail