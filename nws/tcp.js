const net = require('net');
const { exit } = require('process');

const hostname = "127.0.0.1"
const port = 8080

const server = net.createServer(function(socket) {
    socket.setEncoding("utf-8")

    socket.on("data", (data) => {
		const parsedData = data.toString().split("\r\n").splice(1)
		parsedData.forEach(eq => {
			if (!eq.length) return
			const values = eq.substr(1).trim().split(" ")
			let result = 0;
			if (eq.startsWith("+")) {
				result = values.reduce((prev, acc) => Number(prev) + Number(acc), 0)
			} else if (eq.startsWith("-")) {
				result = - values.reduce((prev, acc) => Number(prev) + Number(acc), 0)
			}

			socket.write(result + " ")
		})
        
    })
});

server.listen(port, hostname);

server.on("listening", () => {
	const {port, family} = server.address();

	console.log(`${hostname} is listening at port ${port}, its ip is of type ${family}`)
})

server.on("connection", (socket) => {
	socket.localPort
	console.log("server is " + socket.address().family)
})

const client = new net.Socket();

client.connect(port, hostname, function() {
	client.write('client connection\r\n')
	client.write('+ 2 2 2 2\r\n');
	client.write('+ 1 1 2 2\r\n');
	client.write('- 1 1 2 2\r\n');
	client.write('- 9 8 2 2\r\n');
	
});

client.on('data', (data) => {
	console.log('Sums are: ' + data);
	client.destroy()
});

client.on('close', () => {
	console.log('Connection closed');
	exit()

});