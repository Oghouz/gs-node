var http = require('http');

httpServer = http.createServer(function (request, response) {
    console.log('Http server stared');
});

httpServer.listen(1337, function() {
	console.log('listening on *:1337');
});

var io = require('socket.io').listen(httpServer);
var users = {};
var allSocket = [];
var i = 0;

io.on('connection', function (socket) {

	console.log('New user connected');

	socket.on('addUser', function(user){

		users[user.userid] = user;
		allSocket[user.userid] = socket;
		io.sockets.emit('userslist', users);
		//socket.broadcast.emit('userslist', users);
		console.log('Emit addUser');
	});

	socket.on('private_message', function (data) {
		var target = allSocket[data.to];
		console.log(data);
		if (target) {
			console.log('send pmsg');
			target.emit("pmsg", data);
		}
	});
	
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});

});

