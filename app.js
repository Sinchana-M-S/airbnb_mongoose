// Core Module
const path = require('path');

// External Module
const express = require('express');
const session = require('express-session');

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const { default: mongoose } = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded());
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false
}));
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
})
app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req,res,next)=> {
  if(req.isLoggedIn) {
    next();
  }
  else{
    res.redirect("/login");
  }
});
app.use("/host", hostRouter);

app.use(express.static(path.join(rootDir, 'public')))

app.use(errorsController.pageNotFound);

const PORT = 3005;
const DB_PATH = "mongodb+srv://root:root@airbnbcluster.le7zbkz.mongodb.net/airbnb_mongoose?retryWrites=true&w=majority&appName=airbnbCluster";

mongoose.connect(DB_PATH).then(() => {
  console.log('Connected to Mongo');
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('Error while connecting to Mongo: ', err);
});