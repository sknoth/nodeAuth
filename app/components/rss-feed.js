var request = require("request");
var parseString = require('xml2js').parseString;

module.exports = {

  renderPage(page, req, res) {

    request("http://www.news-medical.net/tag/feed/Parkinsons-Disease.aspx",
      function(error, response, data) {

        parseString(data, function (err, result) {

            res.render(page, {
              message: req.flash('patient overview'),
              user : req.user,
              articles: result.rss.channel
            });
        });
      });
  }
};
