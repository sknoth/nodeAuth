var request = require("request");
var parseString = require('xml2js').parseString;
var async = require("async");
var fs = require('fs');
var parse = require('csv-parse');

module.exports = {

  renderPage(page, req, res) {

    var parser = parse({delimiter: ','}, function(err, data) {

      var csvData = data;
      var patientDataArr = [];
      var lookupList = [
        'http://4me302-16.site88.net/index.php?table=User',
        'http://4me302-16.site88.net/index.php?table=Therapy',
        'http://4me302-16.site88.net/index.php?table=Therapy_List',
        'http://4me302-16.site88.net/index.php?table=Test',
        'http://4me302-16.site88.net/index.php?table=Test_Session',
        'http://4me302-16.site88.net/index.php?table=Note',
        'http://4me302-16.site88.net/index.php?table=Medicine'
      ];

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

          res.render(page, {
            message: req.flash('manage-patients'),
            user : req.user,
            csvData: csvData,
            patientDataArr: patientDataArr
          });
      });

    });

    fs.createReadStream('data/data1.csv').pipe(parser);
  }
};
