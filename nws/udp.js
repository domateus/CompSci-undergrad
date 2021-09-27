const udp = require('dgram');
const { exit } = require('process');

const hostname = "127.0.0.1"
const port = 8081

const server = udp.createSocket('udp4');

server.on('message',function(msg,info){
  const parsedData = msg.toString().split("[]");
  let sums = "";
  parsedData.forEach(eq => {
    if (!eq.length) return
    const values = eq.substr(1).trim().split(" ")
    let result = 0;
    if (eq.startsWith("+")) {
      result = values.reduce((prev, acc) => Number(prev) + Number(acc), 0)
    } else if (eq.startsWith("-")) {
      result = - values.reduce((prev, acc) => Number(prev) + Number(acc), 0)
    }
      sums += `${result} `
  })
  server.send(sums, info.port, hostname);
  

});

server.on('listening',function(){
  const {port, family} = server.address();
   
  console.log(`${hostname} is listening at port ${port}, its ip is of type ${family}`)
});

server.bind(port);

const client = udp.createSocket('udp4');

client.on('message',function(msg,info){
  console.log('Sums are: ' + msg.toString());
  client.close();

});

const clientMsg = Buffer.from('+ 2 2 2 2[]+ 1 1 2 2[]- 1 1 2 2[]- 9 8 2 2');

client.send(clientMsg, port, hostname);

client.on("close", () => {
  console.log('Connection closed');
  exit();
})

