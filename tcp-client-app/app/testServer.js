var net = require('net');
var clients = [];

function TestServer(port, host) {
    broadcast();
    net.createServer(function (socket) {
        
        // Identify this client
        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        clients.push(socket);

        // Send a nice welcome message and announce
        socket.write("Welcome " + socket.name + "\n");
        
        // Handle incoming messages from clients.
        socket.on('data', function (data) {
            var requestType = "";
            var error = "";
            try {
                var dataFromClient = JSON.parse(data);
                if (dataFromClient["request"]) {
                    requestType = dataFromClient["request"];
                }
            } catch (err) {
                error = "Invalid message from client " + socket.name;
            } finally {
                if (error) {
                    socket.write(JSON.stringify({ "Server Response To Client": error }));
                    error = "";
                } else if (requestType) {
                    socket.write(JSON.stringify({ "Server Response To Client": dataFromClient }));
                } else {
                    socket.write(JSON.stringify({ "Server Response To Client": "I did not understand " + socket.name + " request" }));
                }
            }
        });

        socket.on('end', function () {
            clients.splice(clients.indexOf(socket), 1);
            //broadcast(socket.name + " left the chat.\n");
        });

    }).listen(port, host);
}

function broadcast() {
    setInterval(function () {
        clients.forEach(function (client) {
            client.write(JSON.stringify({ "NumberOfClientsListening": clients.length, "type": "heartbeat" }));
        });
    }, 4000)
}

module.exports = TestServer;