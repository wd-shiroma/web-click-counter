var sqlite3 = require('sqlite3');

var db = new sqlite3.Database('./db.sql');

var actions = {};

actions.init = function(buttons) {
    db.serialize(function() {
        db.run('create table web_counter (button text primary key, counter integer default 0)');
        buttons.forEach(btn => {
            db.run('insert into web_counter (button) values ($button)', { '$button': btn.type });
        })
    });
};
/*
actions.get_user_counts = function(user) {
    return new Promise(resolve => {
        db.serialize(function() {
            let sql = 'select * from web_counter';
            if (user) sql += ' where user=\'' + user + '\'';

            db.all(sql, function(err, res) {
                if (err) resolve({ result: false, error: err });
                else resolve({ result: true, rows: res || [] });
            });
        });
    });
};
*/
actions.get_button_counts = function(button) {
    let promise = new Promise((resolve, reject) => {
        let sql = 'select button, counter from web_counter';
        if (button) sql += ' where button=\'' + button + '\'';
        sql += ' group by button';

        db.serialize(function() {
            db.all(sql, function(err, res) {
                if (err) reject(err);
                else if (button) resolve(res[0]);
                else resolve(res);
            });
        });
    });
    promise.catch(e => {
        console.log(e);
    });
    return promise;
};

actions.update_count = async function(button) {
    let promise = new Promise((resolve, reject) => {
        db.serialize(function() {
            let sql = 'update web_counter set counter=counter+1 where button=$button';
            let result = db.run(sql, { '$button': button });
            if (result) resolve();
            else reject();
        });
    });
    promise.catch(e => {
        console.log(e);
    });
    return promise;
};

module.exports = actions;