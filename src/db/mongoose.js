const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://trickytactoe:amps@engage2020@cluster0.gho9z.mongodb.net/tricky-tac-toe?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
);
