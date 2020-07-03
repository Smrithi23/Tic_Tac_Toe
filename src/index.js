const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const path = require('path')
const hbs = require('hbs')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
