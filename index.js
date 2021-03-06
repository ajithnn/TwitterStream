var Twitter = require('node-tweet-stream');
var express = require('express');
var app = express();
var server = require('http').Server(app)
var io = require('socket.io')(server);
var details = {
        consumer_key: "1UYq6gKJJJ0om2rmuJZapXebM",
        consumer_secret: "2LD6gJQhrpP8hHWwsstWtzILtaYVAO9ZcLmUBxqU3f9qqdwcfs",
        token: "3219357451-MGlyvKa8nvc5BFhIFrQ5zvsnhq0keumcrHYMAlW",
        token_secret: "lTt2D9Ns3KP0WwI2gZLSoVlqJxaUNN6XYbminKLJPUXo3"
};
var timeDict ={};
var curSearch ={};
var dictLength = {};
var t ={};
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

io.on('connection',function(socket){
try{
	timeDict[socket.id] = {};
	curSearch[socket.id] = "";
	dictLength[socket.id] = 0;
	t[socket.id] = new Twitter(details);


	t[socket.id].on('tweet', function (tweet) {
		var countr = Counter(tweet.text,curSearch[socket.id]);
		var curTime = tweet.created_at.toString().substr(11,5);
		timeDict[socket.id][curTime] = timeDict[socket.id][curTime] + countr || countr;
		io.to(socket.id).emit('NewTweet',tweet.text);
		//if(dictLength[socket.id] != Object.keys(timeDict[socket.id]).length){
			dictLength[socket.id] = Object.keys(timeDict[[socket.id]]).length;
			io.to(socket.id).emit('NewTime',timeDict[socket.id]);
		//}
	});
	 
	t[socket.id].on('error', function (err) {
	  console.log(err)
	})

  socket.on('disconnect', function () {
    t[socket.id].untrack(curSearch);
	timeDict = {};
	dictLength = 0;
  });
}
catch(e){
	console.log(e);
}
});



app.use('/', express.static(__dirname + '/client'));

app.get("/search",function(req,res){
	t[req.query.id].untrack(curSearch);
	timeDict[req.query.id] = {};
	dictLength[req.query.id] = 0;
	curSearch[req.query.id] = req.query.q;
	t[req.query.id].track(curSearch[req.query.id]);
	res.sendStatus(200);
});

app.get("/",function(req,res){
        res.sendFile("client/",{ "root": __dirname });
});

server.listen(process.env.PORT||3000);


