var request = require("request");

module.exports = {

  renderPage(page, req, res) {

    request("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLwKZdOHmwfHGBPT0t5j3NWjrSGil2UNGD&maxResults=50&key=AIzaSyCHO1c4kXxpJx34Pf0ETlXkA-MeDFVznTU",
      function(error, response, data) {

        var data = JSON.parse(data);
        var videos = data.items;
        var videoIds = [];

        for (var key in videos) {
          videoIds.push(videos[key].snippet.resourceId.videoId);
        }

        res.render(page, {
          message: req.flash('video list'),
          user : req.user,
          videoIds: videoIds
        });
      });
  }
};
