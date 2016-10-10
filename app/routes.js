module.exports = function(app, passport) {

  var feed = require('feed-read');
  var request = require("request");

  app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    var parseString = require('xml2js').parseString;
    var async = require("async");

    var fs = require('fs');
    var parse = require('csv-parse');


    app.get('/manage-patients', isLoggedIn, function(req, res) {

      var user = req.user;

      var parser = parse({delimiter: ','}, function(err, data) {

        var csvData = data;

        var lookupList = [
          'http://4me302-16.site88.net/index.php?table=User',
          'http://4me302-16.site88.net/index.php?table=Therapy',
          'http://4me302-16.site88.net/index.php?table=Therapy_List',
          'http://4me302-16.site88.net/index.php?table=Test',
          'http://4me302-16.site88.net/index.php?table=Test_Session',
          'http://4me302-16.site88.net/index.php?table=Note',
          'http://4me302-16.site88.net/index.php?table=Medicine'
        ];

        var patientDataArr = [];

        // solution from: http://stackoverflow.com/questions/32442426/solution-found-node-js-async-parallel-requests-are-running-sequentially
        async.map(lookupList, function(url, callback) {

            // iterator function
            request(url, function (error, response, body) {

                if (!error && response.statusCode == 200) {

                    // do any further processing of the data here
                    callback(null, body);
                } else {
                    callback(error || response.statusCode);
                }
            });
        }, function(err, results) {

            if (err)
              return false;

            // process all results in the array here
            for (var i = 0; i < results.length; i++) {

              parseString(results[i], function (err, result) {
                patientDataArr.push(result);
              });
            }

            console.log(patientDataArr);

            res.render('pages/manage-patients.ejs', {
              message: req.flash('manage-patients'),
              user : req.user,
              csvData: csvData,
              patientDataArr: patientDataArr
            });
        });

      });

      fs.createReadStream('data/data1.csv').pipe(parser);

    });


    app.get('/video-list', isLoggedIn, function(req, res) {

      var user = req.user;

      request("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLwKZdOHmwfHGBPT0t5j3NWjrSGil2UNGD&maxResults=50&key=AIzaSyCHO1c4kXxpJx34Pf0ETlXkA-MeDFVznTU",
        function(error, response, data) {

          var data = JSON.parse(data);
          var videos = data.items;
          var videoIds = [];

          for (var key in videos) {
            videoIds.push(videos[key].snippet.resourceId.videoId);
          }

          res.render('pages/video-list.ejs', {
            message: req.flash('video list'),
            user : user,
            videoIds: videoIds
          });
        });

    });

    app.get('/rss-feed', isLoggedIn, function(req, res) {

      request("http://www.news-medical.net/tag/feed/Parkinsons-Disease.aspx",
        function(error, response, data) {

          parseString(data, function (err, result) {

              res.render('pages/rss-feed.ejs', {
                message: req.flash('patient overview'),
                user : req.user,
                articles: result.rss.channel
              });
          });
        });
    });

    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('pages/profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

      // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
    }));

    // =====================================
      // TWITTER ROUTES ======================
      // =====================================
      // route for twitter authentication and login
      app.get('/auth/twitter', passport.authenticate('twitter'));

      // handle the callback after twitter has authenticated the user
      app.get('/auth/twitter/callback',
          passport.authenticate('twitter', {
              successRedirect : '/profile',
              failureRedirect : '/'
      }));


      // =====================================
      // GOOGLE ROUTES =======================
      // =====================================
      // send to google to do the authentication
      // profile gets us their basic information including their name
      // email gets their emails
      app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

      // the callback after google has authenticated the user
      app.get('/auth/google/callback',
              passport.authenticate('google', {
                      successRedirect : '/profile',
                      failureRedirect : '/'
              }));

      // =============================================================================
      // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
      // =============================================================================

      // locally --------------------------------
      app.get('/connect/local', function(req, res) {
          res.render('connect-local.ejs', { message: req.flash('loginMessage') });
      });
      app.post('/connect/local', passport.authenticate('local-signup', {
          successRedirect : '/profile', // redirect to the secure profile section
          failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
          failureFlash : true // allow flash messages
      }));

      // facebook -------------------------------

      // send to facebook to do the authentication
      app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

      // handle the callback after facebook has authorized the user
      app.get('/connect/facebook/callback',
          passport.authorize('facebook', {
              successRedirect : '/profile',
              failureRedirect : '/'
          }));

      // twitter --------------------------------

      // send to twitter to do the authentication
      app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

      // handle the callback after twitter has authorized the user
      app.get('/connect/twitter/callback',
          passport.authorize('twitter', {
              successRedirect : '/profile',
              failureRedirect : '/'
          }));


      // google ---------------------------------

      // send to google to do the authentication
      app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

      // the callback after google has authorized the user
      app.get('/connect/google/callback',
          passport.authorize('google', {
              successRedirect : '/profile',
              failureRedirect : '/'
          }));



    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page

    res.redirect('/');
}
