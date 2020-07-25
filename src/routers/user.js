const express = require("express");
const hbs = require("hbs");
const User = require("../models/user");
const auth = require('../middleware/auth')

const router = new express.Router();
router.use(express.urlencoded())

const Cookies = require("cookies");

//Registration page
router.get("/register", async (req, res) => {
  res.status(200).render('register');
});

//User registration
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    console.log(req.body.username);
    console.log(req.body.email);
    console.log(req.body.password);
    await user.save();
    const token = await user.generateAuthToken()
    var cookies = new Cookies(req, res)
    cookies.set('token', token)
    res.status(200).render('dashboard', { username : user["username"], email : user["email"], highscore : user["highscore"] });
  } catch (e) {
    console.log(e)
    let passworderror, emailerror, register_message;
    if(e.errors.password) {
      passworderror = "Password must be atleast 8 characters long";
    }
    if(e.errors.email) {
      emailerror = "Invalid Email";
    }
    if (e.code === 11000 && e.password == null && e.email == null) {
      register_message = "Already Registered"
    }
    res.status(400).render('register', { passworderror, emailerror, register_message })
  }
});

//Login page
router.get("/", async (req, res) => {
  res.status(200).render("login")
})

//User login
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
    const token = await user.generateAuthToken();
    var cookies = new Cookies(req, res)
    cookies.set('token', token)
    res.status(200).render('dashboard', { username : user["username"], email : user["email"], highscore : user["highscore"] });
  } catch (e) {
    const loginerror = "Incorrect email or password"
    res.status(400).redirect('/', { loginerror })
  }
});

router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
    return token.token !== req.token;
    })
    await req.user.save()
    res.status(201).redirect('/');
  } catch (e) {
    res.status(500).send(e);
  }
})

//Leaderboard - sends usernames and scores in descending order
router.get("/leaderboard", auth, async (req, res) => {
  try {
    const user = await User.find({}, { username: 1, highscore: 1, _id: 0 });
    let leaderboard = user.slice().sort((a, b) => b.highscore - a.highscore);
    res.status(200).render('leaderboard', { leaderboard });
  } catch (e) {
    res.status(500).send(e);
  }
});


//update highscore
router.post('/updatehighscore',auth, async (req, res) => {
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
router.get("/dashboard", auth, async (req, res) => {
  try {
    res.status(200).render("dashboard", { username : req.user.username, email : req.user.email, highscore : req.user.highscore });
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/game", auth, async(req, res) => {
  try {
    const user = await User.findOne({username : req.user.username}, { username: 1, highscore: 1, _id: 0 });
    console.log(user.highscore);
    res.status(200).render("game", {highscore : user.highscore});
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;