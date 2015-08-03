var kafka = require('kafka-node'),
    HighLevelConsumer = kafka.HighLevelConsumer,
    client = new kafka.Client(),
    consumer = new HighLevelConsumer(
        client,
        [
            { topic: 'chatmessages' }
        ],
        {
            groupId: 'chat-server-group'
        }
    );

module.exports = function(chatServer) {

    consumer.on('message', function (kafkaMessage) {
        console.log('Received message ' + kafkaMessage.value);
        var message = JSON.parse(kafkaMessage.value);
        chatServer.broadcast(message);
    });

    return {};
};