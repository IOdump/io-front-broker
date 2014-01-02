var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , amqp          = require('amqp');


var connection = amqp.createConnection({ host: '127.0.0.1' }, { reconnect: true });

app.listen(3100);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

connection.on('ready', function () {

  console.log('rabbitmq connected !');
  var exchange = connection.exchange('realtime');
  var queue = connection.queue('io-front-broker');

  queue.bind(exchange, '#');

  io.sockets.on('connection', function (socket) {
    queue.subscribe(function (message) {
      console.log(message);
      socket.emit(message.topic, message);
    });

  });

});
