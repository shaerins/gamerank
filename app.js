const express =        require("express"),
      app =            express(),
      bodyParser =     require("body-parser"),
      mongoose =       require("mongoose"),
      passport =       require("passport"),
      LocalStrategy =  require("passport-local"),
      expressSession = require("express-session"),
      methodOverride = require("method-override"),
      Game =           require("./models/game"),
      Comment =        require("./models/comment"),
      User =           require("./models/user"),
      seedDB =         require("./seeds");

// require all routes
const indexRoutes =   require("./routes/index"),
      gameRoutes =    require("./routes/games"),
      commentRoutes = require("./routes/comments");

mongoose.connect("mongodb://localhost:27017/gamerank", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method")); // allows us to use PUT method
app.set("view engine", "ejs"); // wihout this, need to type .ejs extension for every page

// seedDB();

// PASSPORT CONFIG
app.use(expressSession({
  secret: "kelly the small dog",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// keeps track if there is a user signed in
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// use required routes files
// can also do "app.use("/games", gameRoutes);" if each route begins with "/games" to auto append to each route
app.use(indexRoutes);
app.use(gameRoutes);
app.use(commentRoutes);

app.listen(8080, "localhost", function() {
  console.log("gamerank server is running...");
});
