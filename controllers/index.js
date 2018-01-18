var db = require('../models/db');

var actions = {};

actions.get_counts = async function(buttons) {
    let counts;
    counts = await db.get_button_counts();
    counts = counts.map( cnt => {
        let button = buttons.find(btn => {
            return cnt.button === btn.type;
        });
        if (button) cnt = Object.assign(cnt, button);
        return cnt;
    });

    return counts;
}

module.exports = actions;