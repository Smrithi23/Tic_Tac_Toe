const express = require("express");
const hbs = require("hbs");
const User = require("../models/user");
const router = new express.Router();

//home
router.get('', (req, res) => {
  res.render('index')
})

//Registration page
router.get("/register", async (req, res) => {
  res.status(200).render('register');
});

//User registration
router.post("/register", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Login page
router.get("/login", async (req, res) => {
  res.status(200).render("login");
});

//User login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send(user);
  } catch (e) {
    console.log(e);

    res.status(400).send();
  }
});

//profile page
router.get('/profile', async (req, res) => {
  res.status(200).render('profile')
})

//Dashboard
router.get("/dashboard", async (req, res) => {
  try {
    res.status(200).render("dashboard");
  } catch (e) {
    res.status(500).send();
  }
});

//Leaderboard - sends usernames and scores in descending order
router.get("/leaderboard", async (req, res) => {
  try {
    const user = await User.find({}, { username: 1, highscore: 1, _id: 0 });
    let sortedscore = user.slice().sort((a, b) => b.highscore - a.highscore);
    res.send('leaderboard',sortedscore);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
