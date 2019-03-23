var express = require("express");
var flash    = require('connect-flash');
var webpush = require("web-push");
var comp = require("compression");
var redis = require('redis');
var app = express();
var utils = require('./utils');
var passport = require("passport");
var localStrategy = require("passport-local");
var mongoose = require("mongoose");
var cache = require("memory-cache");
var compression = require('compression');
var session = require('express-session');
var User = require("./config/user");
var Analytics = require("./config/analytics");
//var Token = require("./config/Token")
var Restaurant =require("./config/Restaurant");
var RestaurantLocation = require("./config/RestaurantLocation");
require("./config/passport")(passport);
var Type = require('type-of-is');
var multer = require('multer');
var async = require("async");
var crypto = require("crypto");
var nodemailer = require("nodemailer");
mongoose.set('useCreateIndex', true) ;
//mongoose.connect("mongodb://localhost/User", { useNewUrlParser: true });
mongoose.connect("mongodb://test_my:testmy1@ds031651.mlab.com:31651/test_my", { useNewUrlParser: true }).then(
    ()=>{
      console.log("connected to mongoDB");
      //Restaurant.create();
    },
   (err)=>{
       console.log("err",err);
  });
  
  let memCache = new cache.Cache();
    let cacheMiddleware = (duration) => {
        return (req, res, next) => {
            let key =  '__express__' + req.originalUrl || req.url
            let cacheContent = memCache.get(key);
            if(cacheContent){
                res.send( cacheContent );
                return
            }else{
                res.sendResponse = res.send
                res.send = (body) => {
                    memCache.put(key,body,duration*1000);
                    res.sendResponse(body)
                }
                next()
            }
        }
    }
 var RememberMeStrategy = require('passport-remember-me').Strategy;
var methodOverride = require("method-override");
var bodyparser = require("body-parser");
app.use(comp());
app.use(compression());
var ejs = require('ejs');
var parse = ejs.parse;
ejs.parse = function(str, options) {
  str = str.replace(/^\s+|\s+$|\n/gm,"");
  return parse.apply(this, [str, options]);
};
app.use(bodyparser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.locals.rmWhitespace = true;
app.use(methodOverride("_method"));

app.use(flash());


app.use(bodyparser.json());

app.use(express.static('views'));
    
      //  app.use(express.logger('dev')); // log every request to the console
      var cookieParser = require('cookie-parser');
      app.use(cookieParser()); // read cookies (needed for auth)
	app.use(bodyparser.urlencoded({extended : true}));// get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating
    
	// required for passport
	app.use(require("express-session")({
		secret: "none",
		resave: false,
		saveUninitialized: false
    })); // session secret
  
    app.use(passport.initialize());
	app.use(passport.session());
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.ejs', {
            success:false,
            chk:false,
            message: 'Error:oops something went wrong',
            error: err.message
        });
    });}
    app.use(function(req,res,next){
     res.locals.sessionID = req.sessionID;
         res.locals.error = req.flash("error");
         res.locals.success = req.flash("success");
         next();
     });
   app.get("/",function(req,res){
        console.log("MY USER"+req.user);
        if(!req.query.Restaurant&&!req.query.Cuisines){
        Restaurant.find({},function(err,allRestaurant){
            if(err)
            {
                console.log("err");
            }
          // console.log(allRestaurant);
            //res.send(JSON.stringify(allPost));
            //console.log( allRestaurant['Aggregate rating']);
            if (req.isAuthenticated())
         var u = true;
         else
         u= false;
            res.render("mainindex.ejs",{chk:u,user:req.user,Restaurant:allRestaurant,result:null});
        });
    }
    else if(req.query.Restaurant&&!req.query.Cuisines)
    {
        const regex = new RegExp(escapeRegex(req.query.Restaurant),'gi');
        Restaurant.find({'Restaurant Name':regex},function(err,allRestaurant){
            if(err)
            {
                console.log("err");
            }
            allRestaurant.forEach(function(item){
                
                Analytics.findOne({mid:item['Restaurant ID']},function(err,analytic){
                    if(err)
                    {
                        console.log("err"+err);
                    }
                   // console.log(analytic.mid);
                   // console.log("myid");
                   // console.log(item['Restaurant ID']);
                    analytic.appearance=analytic.appearance+1;
                    analytic.save();
                });
            });
          // console.log(allRestaurant);
            //res.send(JSON.stringify(allPost));
            //console.log( allRestaurant['Aggregate rating']);
            res.render("mainindex.ejs",{chk:req.isAuthenticated(),user:req.user,user:null,Restaurant:allRestaurant,result:req.query.Restaurant});
            
        });
    }
    else if(!req.query.Restaurant&&req.query.Cuisines)
    {
        const regex = new RegExp(escapeRegex(req.query.Cuisines),'gi');
        Restaurant.find({'Cuisines':regex},function(err,allRestaurant){
            if(err)
            {
                console.log("err");
            }
          // console.log(allRestaurant);
            //res.send(JSON.stringify(allPost));
            //console.log( allRestaurant['Aggregate rating']);
            res.render("mainindex.ejs",{chk:req.isAuthenticated(),user:req.user,user:null,Restaurant:allRestaurant,result:req.query.Cuisines});
        });
    }
});

app.get("/sortby/rating",function(req,res){

    Restaurant.find({}).sort({'Aggregate rating':1}).exec(function(err,allRestaurant){
        if(err)
        {
            console.log("err");
        }
      // console.log(allRestaurant);
        //res.send(JSON.stringify(allPost));
        //console.log( allRestaurant['Aggregate rating']);
        if (req.isAuthenticated())
     var u = true;
     else
     u= false;
        res.render("mainindex.ejs",{chk:u,user:req.user,Restaurant:allRestaurant,result:null});
    });

});
app.get("/sortby/votes",function(req,res){

    Restaurant.find({}).sort({'Votes':1}).exec(function(err,allRestaurant){
        if(err)
        {
            console.log("err");
        }
      // console.log(allRestaurant);
        //res.send(JSON.stringify(allPost));
        //console.log( allRestaurant['Aggregate rating']);
        if (req.isAuthenticated())
     var u = true;
     else
     u= false;
        res.render("mainindex.ejs",{chk:u,user:req.user,Restaurant:allRestaurant,result:null});
    });

});
app.get("/sortby/avgcost",function(req,res){

    Restaurant.find({}).sort({'Average Cost for two':1}).exec(function(err,allRestaurant){
        if(err)
        {
            console.log("err");
        }
      // console.log(allRestaurant);
        //res.send(JSON.stringify(allPost));
        //console.log( allRestaurant['Aggregate rating']);
        if (req.isAuthenticated())
     var u = true;
     else
     u= false;
        res.render("mainindex.ejs",{chk:u,user:req.user,Restaurant:allRestaurant,result:null});
    });

});



////////////////////detail page//////////////////////////////////

app.get("/restaurant/:id",function(req,res){
    if (req.isAuthenticated())
    var u = true;
    else
    u= false;
    Restaurant.findById(req.params.id,function(err,restaurant){
        RestaurantLocation.find({'Restaurant ID':restaurant['Restaurant ID']},function(err,resloc){
            console.log(resloc);
            Analytics.findOne({mid:restaurant['Restaurant ID']},function(err,resA){
        if(err)
        {
            console.log(err);
        }
        res.render("restaurantPage.ejs",{chk:u,user:req.user,restaurant:restaurant,resloc:resloc,resA:resA});
    });
    });
});
});
////////////////////////////  AUTH     ////////////////////////////

app.get("/acc",function(req,res){
    res.render("index.ejs",{chk:false});
});
app.get('/login', function(req, res) {
    res.render('login.ejs',{chk:false});
});
app.get('/signup', function(req, res) {
        
    res.render('signup.ejs', { message: req.flash('loginMessage'),chk:false });
});
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    //req.flash("error","wrong password");
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));
app.post("/login", passport.authenticate('local-login',
    { failureRedirect: '/login',
      failureFlash: true }),
      function(req, res) {
        res.redirect('/');
      });
      app.get('/logout', function(req, res) {
        res.clearCookie('remember_me');
        req.logout();
        req.flash("error","You Logged Out");
		res.redirect('/');
    });



function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");
}
        
 
app.listen(process.env.PORT || 3000);
