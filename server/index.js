var Twitter = require('node-tweet-stream')
  , t = new Twitter({
        consumer_key: "1UYq6gKJJJ0om2rmuJZapXebM",
        consumer_secret: "2LD6gJQhrpP8hHWwsstWtzILtaYVAO9ZcLmUBxqU3f9qqdwcfs",
        token: "3219357451-MGlyvKa8nvc5BFhIFrQ5zvsnhq0keumcrHYMAlW",
        token_secret: "lTt2D9Ns3KP0WwI2gZLSoVlqJxaUNN6XYbminKLJPUXo3"
	})
var express = require('express');
var app = express();
	var timeDict = {};
	var curSearch = "";
function Counter(tweet,search){
	var count = 0;
	var val = tweet.toString().split(' ');
	var patt = new RegExp("#?" + search);
	for(var i in val){
		if(patt.test(val[i].toLowerCase())){
			count++;
		}
	}
return count;
}

t.on('tweet', function (tweet) {
var countr = Counter(tweet.text,curSearch);
var curTime = tweet.created_at.toString().substr(11,5);
timeDict[curTime] = timeDict[curTime] + countr || countr;
console.log(timeDict);
})
 
t.on('error', function (err) {
  console.log('Oh no')
})

app.get("/search",function(req,res){
	t.untrack(curSearch);
	timeDict = {};
	curSearch = req.query.q;
	t.track(curSearch);
	res.send(200);
});

app.listen(3000);


