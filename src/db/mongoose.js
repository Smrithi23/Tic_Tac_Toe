const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://trickytactoe:<password>@cluster0.gho9z.mongodb.net/<dbname>?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
);
