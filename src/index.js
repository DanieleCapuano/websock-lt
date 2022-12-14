export const start_ws = _start_ws;
export const send_ws_msg = _send_ws_msg;

let connection = null,
    retry_itv = null;
const CONFIG = window.CONFIG || {};

function _start_ws(port, callback) {
    port = port || '6789';
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

        connection.addEventListener('message', function (message) {
            let data = message.utf8Data || message.data;
            if (CONFIG._DEBUG_) console.log("Received: '" + data + "'");
            callback && callback(JSON.parse(data));
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
    connection.send(msg);
}