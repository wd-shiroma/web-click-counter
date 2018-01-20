var ws;
var res = {};
var context = new AudioContext();
var share_url = {
    toot: 'https://mastportal.info/intent?text=',
    tweet: 'https://twitter.com/intent/tweet?text='
};
var user_counts = {};

effects.forEach(function(e) {
    if (!Array.isArray(res[e.button])) res[e.button] = [];
    var req = new XMLHttpRequest();
    var src = '/sounds/' + e.file;
    req.responseType = 'arraybuffer';
    req.onreadystatechange = function() {
        if (req.readyState === 4 && (req.status === 0 || req.status === 200)) {
            if (req.response) {
                context.decodeAudioData(req.response, function(buffer) {
                    res[e.button].push( Object.assign(e, {
                        source: src,
                        buffer: buffer
                    }));
                });
            }
            else {
                console.log('failed to get resource: ' + src);
                resource.buffer = undefined;
            }
        }
    };
    req.open('GET', src, true);
    req.send('');
});

// on click button
// template text variables:
//   {title}                system.title
//   {url}                  location.href
//   {button_title}         buttons.title
//   {button_count}        (button counter)
//   {all_count}           (total all counter)
//   {user_button_count}   (user counter)
//   {user_all_count}      (all count per user)
var share = function() {
    var type = $(this).parents('.btn_form').data('type');
    var share_type = $(this).prop('class');
    var target = $(this).parent().prop('class');
    var counter = $(this).parent().prevAll('.counter');
    var text = $('#' + target + '_text').text();

    var title = $('#page_title').text();
    var url = location.href;
    var button_title = $(this).parent().prevAll('.btn').text();
    var button_count = (target === 'share_button' ? counter.text() : 0);
    var all_count = Array.from($('.counter')).reduce(
        (cnt, cur) => (typeof cnt === 'number' ? cnt : parseInt($(cnt).text())) + parseInt($(cur).text())
    ) || 0;
    var user_button_count = user_counts[type] || 0;
    var keys = Object.keys(user_counts) || [];
    console.log(keys, user_counts);
    var user_all_count = (keys.length > 1 ? keys.reduce(
        (cnt, cur) => parseInt((typeof cnt === 'number' ? cnt : user_counts[cnt]) + user_counts[cur])
    ) : keys.length > 0 ? user_counts[keys[0]] : 0);

    var parsed_text = encodeURIComponent(text
        .replace(/{title}/g, title)
        .replace(/{url}/g, url)
        .replace(/{button_title}/g, button_title)
        .replace(/{button_count}/g, button_count)
        .replace(/{all_count}/g, all_count)
        .replace(/{user_button_count}/g, user_button_count)
        .replace(/{user_all_count}/g, user_all_count));

    console.log(share_url[share_type] + parsed_text);
    window.open(share_url[share_type] + parsed_text, '_blank');
};

//https://twitter.com/intent/tweet?url=<URL>&text=<テキスト>&via=<ユーザーID>&hashtags=<タグ名>&related=<ユーザーID>

var countup = function(e) {
    var parent = $(e.target).parent();
    var counter = parent.find('.counter');
    var data = { 'button': parent.data('type') };

    if (!user_counts[data.button]) user_counts[data.button] = 0;
    if (res[data.button]) play_effect(res[data.button]);

    counter.text(parseInt(counter.text()) + 1);
    ws.send(JSON.stringify(data));
    user_counts[data.button]++;
};

var play_effect = function(_res = []) {
    if (!_res.length) return false;

    var weight_all = _res.reduce( (v, r) => (v.weight ? v.weight : v) + r.weight );
    var rand = Math.floor( Math.random() * (weight_all + 1) );

    var resource;
    for (r in _res) {
        resource = _res[r];
        if ((rand -= _res[r].weight) < 0) {
            break;
        }
    }
    if (!resource) return false;

    var source = context.createBufferSource();
    source.buffer = resource.buffer;
    source.connect(context.destination);
    source.start(0);
}

// streaming
var closed_streaming = function() {
    console.log('closed');
    $('.streaming_error').show('first');
};

var start_streaming = function() {
    console.log('start');
    ws = null;
    ws = new WebSocket('ws://' + domain + ':4000/');
    ws.onmessage = receive_message;
    ws.onclose = closed_streaming;
    $('.streaming_error').hide('first');
}

var receive_message = function(event) {
    var data = JSON.parse(event.data);
    if (data.polling) return true;
    $('.counter').each(function() {
        if ($(this).parent().data('type') === data.button && parseInt($(this).text()) < data.counter) {
            $(this).text(data.counter);
        }
    });
};

// initialization
$(function() {
    start_streaming();
    $('.btn').on('click', countup);
    $('.streaming_connect').on('click', start_streaming);
    $('[name=btn_share]').on('click', share);
});
