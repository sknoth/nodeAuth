// module.exports = {
//
//   getVideos: function() {
//
// var request = require('request');
//
//     var videos;
//     request.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UUrNRiQqbEGUtV17i4aiwGmg&key=AIzaSyCHO1c4kXxpJx34Pf0ETlXkA-MeDFVznTU', function(err, header, body) {
//
//       if (err) throw err
//
//       console.log(JSON.parse(body));
//       videos = JSON.parse(body);
//     });
//
//     return videos;
//   },
//
//   getSomething: function() {
//     var request = require("request");
//     var EventEmitter = require("events").EventEmitter;
//     var body = new EventEmitter();
//
//     request("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UUrNRiQqbEGUtV17i4aiwGmg&key=AIzaSyCHO1c4kXxpJx34Pf0ETlXkA-MeDFVznTU", function(error, response, data) {
//         body.data = data;
//         body.emit('update');
//     }.bind({body:body}));
//
//
//   }
// };
