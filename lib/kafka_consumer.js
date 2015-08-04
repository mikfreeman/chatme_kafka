var kafka = require('kafka-node'),
    HighLevelConsumer = kafka.HighLevelConsumer,
    client = new kafka.Client();

module.exports = function(chatServer, groupId) {

    var consumer = new HighLevelConsumer(
        client,
        [
            { topic: 'chatmessages' }
        ],
        {
            groupId: groupId
        }
    );

    consumer.on('message', function (kafkaMessage) {
        console.log('Received message ' + kafkaMessage.value);
        var message = JSON.parse(kafkaMessage.value);
        chatServer.broadcast(message);
    });

    return {};
};