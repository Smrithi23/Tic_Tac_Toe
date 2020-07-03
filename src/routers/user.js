const express = require("express");
const hbs = require("hbs");
const User = require("../models/user");
const auth = require('../middleware/auth')

const router = new express.Router();

//Login page
router.get("/", async (req, res) => {
  res.status(200).render("login")
})

//User login
router.post("/", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post('/profile/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send(e)
  }
})

//Registration page
router.get("/register", async (req, res) => {
  res.status(200).render("register");
});

//User registration
router.post("/register", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//profile page
router.get("/profile", auth, async (req, res) => {
  res.status(200).render("profile",{user: req.user});
});

//Leaderboard - sends usernames and scores in descending order
router.get("/profile/leaderboard",auth, async (req, res) => {
  try {
    const user = await User.find({}, { username: 1, highscore: 1, _id: 0 });
    let sortedscore = user.slice().sort((a, b) => b.highscore - a.highscore);
    res.status(200).render('leaderboard', sortedscore);
  } catch (e) {
    res.status(500).send(e);
  }
});


//update highscore

router.patch('/profile',auth, async (req, res) => {
  try {
    const score = req.body.score
    if (score > req.user.highscore) {
      req.user.highscore = score
      req.user.save()
       res.status(200).send(req.user)
    } else {
      res.status(200).send(req.user)
    }
  } catch (e) {
      res.status(400).send(e)
  }
})


//Dashboard
router.get("/dashboard", async (req, res) => {
  try {
    res.status(200).render("dashboard");
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
