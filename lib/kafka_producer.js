var kafka = require('kafka-node'),
    HighLevelProducer = kafka.HighLevelProducer,
    client = new kafka.Client(),
    producer = new HighLevelProducer(client);

module.exports = function(chatServer) {

    producer.on('ready', function () {
        chatServer.on('sendMessage', function (message) {

            var messageString = JSON.stringify(message);
            console.log('Sending message ' + messageString );

            var kafkaMessage = {
                topic: 'chatmessages',
                messages : messageString
            };

            producer.send([kafkaMessage], function (err, data) {

            });
        });
    });

    return {};
};