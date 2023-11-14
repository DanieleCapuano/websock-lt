export const start_ws = _start_ws;
export const send_ws_msg = _send_ws_msg;
export const set_default_connection = _set_default_conn;

let connections = {},
    default_conn = null,
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

function _connect_to_ws(port, callback, resolve, conn_id) {
    console.info("Connecting to websocket...");
    let connection = new WebSocket('ws://localhost:' + port),
        connection_id = conn_id || (new Date()).getTime();

    connections[connection_id] = connection;
    connection.addEventListener('open', function () {
        console.info('WebSocket Client Connected to port ' + port);
        const _call_cb = (d) => {
            callback && callback(JSON.parse(d));
        };

        if (last_msg) {
            _restore_last_message(_call_cb);
        }
        connection.addEventListener('message', function (message) {
            let data = message.utf8Data || message.data;
            if (CONFIG._DEBUG_) console.log("Received: '" + data + "'");
            if (CONFIG.preserve_last_message) _save_last_msg(data, connection);
            _call_cb(data);
        });

        resolve && resolve(connection);
    });

    connection.addEventListener('error', function (error) {
        if (CONFIG._DEBUG_) console.log("Connection Error: " + error.toString());
        connection = null;
        connections[connection_id] = null;
        resolve && resolve();
    });


    connection.addEventListener('close', function () {
        console.warn('Websocket Connection Closed');
        connection = null;
        connections[connection_id] = null;

        if (!(retry_itv || {})[connection_id]) {
            retry_itv = retry_itv || {};
            retry_itv[connection_id] = setInterval(() => {
                if (connections[connection_id]) {
                    clearInterval(retry_itv[connection_id]);
                    retry_itv[connection_id] = null;
                    return;
                }
                _connect_to_ws(port, callback, resolve, connection_id);
            }, 3000);
        }
    });
}

function _set_default_conn(conn) {
    default_conn = conn;
}

let warning_message_given = false;
function _send_ws_msg(data, conn) {
    let conn_ids = Object.keys(connections),
        connection = conn || default_conn || connections[conn_ids[0]] || { send: () => 'fake_connection' };
    if (!connection.readyState) {
        if (!warning_message_given) //give it just once
            console.warn("No WS Connection available: No Message sent");
        warning_message_given = true;
        return;
    }
    let msg = JSON.stringify(
        data
    );
    connection.send(msg);

    if (CONFIG._DEBUG_) console.info("MSG", msg);
    if (CONFIG.preserve_last_message) _save_last_msg(data, connection);
}

function _save_last_msg(data, conn) {
    if (CONFIG.preserve_last_message) {
        let c = CONFIG.preserve_last_message;
        if (c.id) {
            //we want the last message(s) to be indexed by id
            last_msg = last_msg || {};

            //the client can transform the saved message so that, if recovered, it could be sent with changes
            //(it's a recovery message, so maybe it should not have the same information, e.g. timing, of the original one)
            last_msg[data[c.id]] = {
                conn,
                msg: (c.transform_msg || (m => m))(data)
            };
        }
        else {
            last_msg = {
                conn,
                msg: data
            };
        }
    }
}

function _restore_last_message(fn) {
    const c = CONFIG.preserve_last_message,
        _send = (d) => {
            fn && fn(d.msg, d.conn);
            _send_ws_msg(d.msg, d.conn);
        };

    if (c.id) Object.keys(last_msg).forEach(last_msg_id => _send(last_msg[last_msg_id]));
    else _send(last_msg);
}