const { assert } = require('chai');

const { getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
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
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = {
        id: "userRandomID", 
        email: "user@example.com", 
        password: "purple-monkey-dinosaur"
    }
    assert.deepEqual(user, expectedOutput)
  });
});

const testUrlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: 'userRandomID' },
  "9sm5xK": { longURL:  "http://www.google.com", userID: 'userRandomID' }
};

describe('urlsForUser', function() {
  it('should return URLs for users', function() {
    const userID = urlsForUser("userRandomID", testUrlDatabase)
    const expectedOutput = {"b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: 'userRandomID' },
    "9sm5xK": { longURL:  "http://www.google.com", userID: 'userRandomID' }
  }
    assert.deepEqual(userID, expectedOutput);
  })
})
