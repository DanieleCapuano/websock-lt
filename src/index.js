export const start_ws = _start_ws;
export const send_ws_msg = _send_ws_msg;

let connection = null,
    retry_itv = null,
    last_msg = null;

const CONFIG = window.CONFIG || {};

function _start_ws(opts) {
    opts = opts || {};
    let { port, callback, preserve_last_message } = opts;
    port = port || '6789';
    CONFIG.preserve_last_message = preserve_last_message;

    return new Promise((resolve) => {
        try {
            _connect_to_ws(port, callback, resolve);
        } catch (e) {
            resolve();
        }
    });
}

function _connect_to_ws(port, callback, resolve) {
    console.info("Connecting to websocket...");
    connection = new WebSocket('ws://localhost:' + port);
    connection.addEventListener('open', function () {
        console.info('WebSocket Client Connected');
        const _call_cb = (d) => {
            callback && callback(JSON.parse(d));
        };

        if (last_msg) {
            _restore_last_message(_call_cb);
        }
        connection.addEventListener('message', function (message) {
            let data = message.utf8Data || message.data;
            if (CONFIG._DEBUG_) console.log("Received: '" + data + "'");
            if (CONFIG.preserve_last_message) _save_last_msg(data);
            _call_cb(data);
        });

        resolve && resolve(connection);
    });

    connection.addEventListener('error', function (error) {
        if (CONFIG._DEBUG_) console.log("Connection Error: " + error.toString());
        connection = null;
        resolve && resolve();
    });


    connection.addEventListener('close', function () {
        console.warn('Websocket Connection Closed');
        connection = null;
        if (!retry_itv) {
            retry_itv = setInterval(() => {
                if (connection) {
                    clearInterval(retry_itv);
                    retry_itv = null;
                    return;
                }
                _connect_to_ws(port, callback, resolve);
            }, 3000);
        }
    });
}

let warning_message_given = false;
function _send_ws_msg(data) {
    if (!(connection || {}).readyState) {
        if (!warning_message_given) //give it just once
            console.warn("No WS Connection available: No color sent");
        warning_message_given = true;
        return;
    }
    let msg = JSON.stringify(
        data
    );

    if (CONFIG._DEBUG_) console.info("MSG", msg);
    if (CONFIG.preserve_last_message) _save_last_msg(data);
    connection.send(msg);
}

function _save_last_msg(data) {
    if (CONFIG.preserve_last_message) {
        let c = CONFIG.preserve_last_message;
        if (c.id) {
            //we want the last message(s) to be indexed by id
            last_msg = last_msg || {};

            //the client can transform the saved message so that, if recovered, it could be sent with changes
            //(it's a recovery message, so maybe it should not have the same information, e.g. timing, of the original one)
            last_msg[data[c.id]] = (c.transform_msg || (m => m))(data);
        }
        else last_msg = data;
    }
}

function _restore_last_message(fn) {
    const c = CONFIG.preserve_last_message,
        _send = (d) => {
            fn && fn(d);
            _send_ws_msg(d);
        };

    if (c.id) Object.keys(last_msg).forEach(last_msg_id => _send(last_msg[last_msg_id]));
    else _send(last_msg);
}