var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'))

var port = process.env.PORT || 3000;

http.listen(port, function(){
  console.log('listening on *:'+port);
});

var isCounting = false;
var timeStarted;

io.on('connection', function(socket){
	console.log('a user connected');
	if(isCounting){
		socket.emit("start", timeStarted)
	}

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

	socket.on('clicked', function(timeClicked){
		if(isCounting){
			io.emit("reset", timeClicked)
			console.log("Stopped @ " + timeClicked)
			isCounting = false;
		}else{
			io.emit("start", timeClicked)
			console.log("Started @ " + timeClicked)
			isCounting = true;
			timeStarted = timeClicked;
		}
		console.log(isCounting)

	})
});
