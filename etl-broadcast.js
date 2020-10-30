'use strict';
var redis = require('redis');
var client = redis.createClient();

function getOptions(server) {
  return {
    onConnection: function (socket) {
      console.log('a client just connected', socket.id);
      //retrieve latest message from redis and send it to client
      client.get('broadcast:messages:latest', function (err, reply) {
        if (reply) {
          socket.send(JSON.parse(reply), function (err) {
            // console.log('this message (latest) was sent successfully', reply, 'to ' + socket.id);
          });
        } else {
          // console.log('No message or message expired.');
        }
      });
    },
    onDisconnection: function (socket) {
      console.log('a client has disconnected', socket.id);
    },
    onMessage: function (socket, message, next) {
      // console.log('SOCKET AUTH:', socket.auth)
      console.log('client', socket.id, 'has sent message', message);
      //save the message to redis
      var str = JSON.stringify(message);
      client.RPUSH('broadcast:messages', str); // notification history
      client.LRANGE('broadcast:messages', 0, -1, function (err, data) {
        if (data) {
          var lastElement = data[data.length - 1];
          var jsonMessage = JSON.parse(lastElement);
          client.set('broadcast:messages:latest', lastElement, redis.print);
          client.expire('broadcast:messages:latest', jsonMessage.expire);
        }
      });
      //relay the message to connected clients
      server.broadcast(message);
    },
    auth: { type: 'direct' },
    headers: '*'
  };
}
module.exports = {
  getOptions: getOptions
};
