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
			io.emit("reset")
			console.log("Stopped @ " + timeClicked)
			isCounting = false;
		}else{
			const offst = -3000; // arranca la cuenta en -3s
			timeStarted = Date.now() + 4000;
			io.emit("start", timeStarted)
			console.log("Started @ " + timeStarted)
			isCounting = true;
		}
		console.log("isCounting",isCounting)
	})


		socket.on('timesync', function (data) {
	    // con
		// console.log('message', data);
	    socket.emit('timesync', {
	      id: data && 'id' in data ? data.id : null,
	      result: Date.now()
	    });
	  });
});
