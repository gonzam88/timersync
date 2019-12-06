var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

var port = process.env.PORT || 3000;

http.listen(port, function(){
  console.log('listening on *:3000');
});

var isCounting = false;
io.on('connection', function(socket){
	console.log('a user connected');
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
		}
		console.log(isCounting)

	})
});
