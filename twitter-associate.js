var http = require('http');
var qs = require('querystring');
var mecab = require('mecab');
var colors = require('colors');

function checkChar(text) {
  for (var i = 0; i < text.length; i++) {
    var c = text.charCodeAt(i);
    if (c < 256) return false;
  }
  return true;
}


function findNoun(text, old) {
  var nouns = mecab.parse(text)
                   .filter(function(o) {
                     return o[1] === '名詞';
                   })
                   .filter(function(o) {
                     return o[0] != old;
                   })
                   .filter(function(o) {
                     return typeof o[0] != "undefined";
                   })
                   .filter(function(o) {
                     return checkChar(o[0]);
                   })
                   .map(function(o) {
                     return o[0];
                   });
  return nouns[Math.floor(Math.random()*nouns.length)];
}

function colored(text, noun, next) {
  return text.split(noun).join(noun.underline.blue).split(next).join(next.underline.red);
}

function tweetAssociate(noun) {
  http.get({
    host: "search.twitter.com",
    port: 80,
    path: "/search.json?"+qs.stringify({q:noun})+"&rpp=1&lang=ja"
  }, function(res) {
    var body = "";
    res.on('data', function(data) {
      body += data;
    });
    res.on('end', function() {
      var tweet = JSON.parse(body).results[0];
      var next = findNoun(tweet.text, noun);
      console.log("@"+tweet.from_user+":"+noun.underline.blue+"->"+next.underline.red);
      console.log(colored(tweet.text, noun, next)+"\n");
      setTimeout(function() {tweetAssociate(next)}, 5000);
    });
  });
}

tweetAssociate("ほげ");
