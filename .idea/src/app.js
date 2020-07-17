var express = require('express'),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
 	app = express(),
 	bodyParser = require("body-parser"),
 	mongoose = require("mongoose"),
 	Campground = require("../../../../../Desktop/YelpCamp/models/campground"),
 	Comment = require("../../../../../Desktop/YelpCamp/models/comment"),
	methodOverride = require("method-override"),
	User = require("../../../../../Desktop/YelpCamp/models/user"),
	flash = require("connect-flash");
 	seedDB = require("../../../../../Desktop/YelpCamp/seeds");

var commentRoutes = require("../../../../../Desktop/YelpCamp/routes/comments"),
	campgroundRoutes = require("../../../../../Desktop/YelpCamp/routes/campgrounds"),
	indexRoutes = require("../../../../../Desktop/YelpCamp/routes");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seed db
//seedDB();

//passport configuration
app.use(require("express-session")({
	secret: "Once good dog",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.currentUser = req.user;
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(3000, function(){
	console.log("yelpcamp started");
});