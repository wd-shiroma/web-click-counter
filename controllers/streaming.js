var WebSocketServer = require('ws').Server;
var db = require('../models/db');

var wss;

var _decode_data = function(data) {
    var decodedData = JSON.parse(data);
    if (!decodedData || !decodedData.button) {
        return false;
    }
    return decodedData;
};

var _encode_data = function(data = []) {
    return JSON.stringify(data);
}

var _start = function(){
    if (!wss){
        wss = new WebSocketServer({port: 4000});

        wss.broadcast = function(data) {
            this.clients.forEach(function(client){
                if (client) {
                    client.send(data);
                }
            });
        };
    }
    wss.on('connection', function(ws) {
        ws
        .on('message', async function(message) {
            var decoded_data = _decode_data(message);
            var counts = db.get_button_counts(decoded_data.button);
            var counts_updated;

            await db.update_count(decoded_data.button);
            counts_updated = await db.get_button_counts(decoded_data.button);

            wss.broadcast(_encode_data(counts_updated));
        });
    });
};

module.exports.open = _start;