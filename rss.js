var feed = require('feed-read'),  // require the feed-read module
    http = require("http"),
    urls = [
        "http://www.techmeme.com/feed.xml"
        // "https://www.news-medical.net/tag/feed/Parkinsons-Disease.aspx"
    ]; // Example RSS Feeds

http.createServer(function (req, res) {
    // send basic http headers to client
    res.writeHead(200, {
        "Content-Type": "text/html",
        "Transfer-Encoding": "chunked"
    });

    // setup simple html page:
    res.write("<html>\n<head>\n<title>RSS Feeds</title>\n</head>\n<body>");

    // fetch rss feed for the url:
    feed("http://www.techmeme.com/feed.xml", function(err, articles) {

        // loop through the list of articles returned
        for (var i = 0; i < articles.length; i++) {

            // stream article title (and what ever else you want) to client
            res.write("<h3>"+articles[i].title +"</h3>");

            console.log(articles);
        }
    });

}).listen(5000);
