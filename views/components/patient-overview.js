console.log('this is some client site jsA');

// <channel>
//     <title>News-Medical.Net Parkinsons Disease News Feed</title>
//     <description>Latest Parkinsons Disease News and Research</description>
//     <link>http://www.news-medical.net/</link>
//     <language>en-GB</language>
//     <creator>News-Medical.Net</creator>
//     <item>
//       <title>Novel bifunctional dimers show promise in preventing Parkinson's disease</title>
//       <description>A team of researchers from the University of Saskatchewan has developed two caffeine-based chemical compounds that show promise in preventing the ravages of Parkinson's disease.</description>
//       <link>http://www.news-medical.net/news/20160930/Novel-bifunctional-dimers-show-promise-in-preventing-Parkinsons-disease.aspx</link>
//       <comments>http://www.news-medical.net/news/20160930/Novel-bifunctional-dimers-show-promise-in-preventing-Parkinsons-disease.aspx#comment</comments>
//       <guid>http://www.news-medical.net/post.aspx?id=3d01607c-7569-4158-9192-444160401fdb</guid>
//       <pubDate>Fri, 30 Sep 2016 08:18:15 -0400</pubDate>
//     </item>

// var feedUrl = 'http://www.news-medical.net/tag/feed/Parkinsons-Disease.aspx';
//
// $(document).ready(function() {
//     //feed to parse
//     var feed = 'http://www.news-medical.net/tag/feed/Parkinsons-Disease.aspx';
//
//     $.ajax(feed, {
//         accepts:{
//             xml:"application/rss+xml"
//         },
//         dataType:"xml",
//         success:function(data) {
//
//             $(data).find("item").each(function () { // or "item" or whatever suits your feed
//                 var el = $(this);
//                 console.log("------------------------");
//                 console.log("title      : " + el.find("title").text());
//                 console.log("link       : " + el.find("link").text());
//                 console.log("description: " + el.find("description").text());
//             });
//         },
//         error: function(e) { console.log('error', e);}
//     });
//
// });


// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}

// Make the actual CORS request.
function makeCorsRequest() {
  // This is a sample server that supports CORS.
  // var url = 'http://html5rocks-cors.s3-website-us-east-1.amazonaws.com/index.html';
var url = 'http://www.news-medical.net/tag/feed/Parkinsons-Disease.aspx';

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var title = getTitle(text);
    alert('Response from CORS request to ' + url + ': ' + title);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}
makeCorsRequest();
