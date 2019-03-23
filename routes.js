module.exports = function(app,passport){
    app.get("/",function(req,res){
        res.render("index.ejs");
    });
    app.get("/profile",isLoggedIn,function(req,res){
        res.render("profile.ejs",{user:req.user});
    });
    app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
    });
    app.get('/login', function(req, res) {
        res.render('login.ejs');
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }),function(req,res){
        console.log("logged in");
    });
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('loginMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/acc', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/',
				failureRedirect : '/login'
            }));
            // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============

            function isLoggedIn(req, res, next) {
                if (req.isAuthenticated())
                    return next();
            
                    req.flash("error","Please login first");
                    res.redirect("/acc");}

}