var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , amqp          = require('amqp');
  , events = require('events');


var connection = amqp.createConnection({ host: '127.0.0.1' }, { reconnect: true });

// reduce io logging
io.set('log level', 1);
app.listen(3100);

var eventEmitter = new events.EventEmitter();

connection.on('ready', function () {

  console.log('rabbitmq connected !');
  var exchange = connection.exchange('realtime');
  var queue = connection.queue('io-front-broker');

  queue.bind(exchange, '#');


    queue.subscribe(function (message) {
      // console.log(message);
      eventEmitter.emit('rtdata', message);

    });


});


io.sockets.on('connection', function (socket) {
  console.log('io socket connection');

  eventEmitter.on('rtdata', function(message) {
   socket.emit(message.topic, message);
 });

});


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
