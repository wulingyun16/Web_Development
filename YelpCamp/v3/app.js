var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB     = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");




app.get("/", function(req, res) {
    res.render("landing");
});


app.get ("/campgrounds", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
       if (err) {
           console.log(err);
       } else {
           res.render("index", {campgrounds: allCampgrounds});
       }
    });
});


app.post("/campgrounds", function(req, res) {
   // Get data from form and add to the array 
   var name = req.body.name;
   var image = req.body.image;
   var descr = req.body.description;
   var newCampground = {name: name, image: image, description: descr};
   // Create a new campground and save it to DB
   Campground.create(newCampground, function(err, newlyCreated) {
      if (err) {
          console.log(err);
      } else {
          res.redirect("/campgrounds");
      }
   });
});


app.get("/campgrounds/new", function(req, res) {
   res.render("new"); 
});



app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
       if (err) {
           console.log(err);
       } else {
           res.render("show", {campground: foundCampground});
       }
    });
});



app.listen(process.env.PORT, process.env.IP, function() {
   console.log("The YelpCamp server has started!"); 
});