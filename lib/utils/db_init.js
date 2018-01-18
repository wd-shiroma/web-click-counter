var db = require('../../models/db');
var config = require('config');

db.init(config.buttons);

console.log('created db.web_counter table;');