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

/**
 * On new connection
 */
io.on('connection', function (socket) {

    console.log('New user connected');
    //var onlineuser;

    /**
     *  Add new user
     */
    socket.on('addUser', function(user) {
        //onlineuser = user;
        users[user.userid] = user;
        if (!allSocket[user.userid]) {
        	allSocket[user.userid] = socket;
        }
        io.sockets.emit('userslist', users);
        //socket.broadcast.emit('userslist', users);
        console.log('Emit addUser');
    });


    /**
     *  On get private message
     */
    socket.on('private_message', function (data) {
        var target = allSocket[data.to];
        console.log(data);
        if (target) {
            console.log('send pmsg');
            target.emit("pmsg", data);
        }
    });

    /**
     *  On user send discussion request
     */
    socket.on('requestDiscussion', function(user) {
        var target = allSocket[user.to];
        if (target) {
            console.log('user:'+user.from+' send request discussion for user '+user.to);
            target.emit('responseDiscussion', user);
        }
    });

    /**
     *  On user accept discussion
     */
    socket.on('acceptDiscussion', function (user) {
        console.log('user ' + user.to + ' accetp discussion by ' + user.from);
        var target = allSocket[user.from];
        if (target) {
            target.emit('acceptDiscussion', user);
        }
    });

    /**
     *  On user refuse discussion
     */
    socket.on('refuseDiscusstion', function (user) {
        console.log('user ' + user.to + ' refuse discussion by ' + user.from);
        var target = allSocket[user.from];
        if (target) {
            target.emit('refuseDiscusstion', user);
        }
    });

    socket.on('close', function(user) {
    	console.log(user.id + ' - ' + user.name + ' close chat frame');
    	var target = allSocket[user.id];
        if (target) {
        	console.log('emit chatClose')
            target.emit('chatClose', user);
        }
    });

    /**
     *  On user disconnect
     */
    socket.on('disconnect', function() {
    	console.log('user disconnected');
        //console.log('user disconnected', onlineuser.userid);
        //delete users[onlineuser.userid];
        //io.sockets.emit('userslist', users);
    });

});
