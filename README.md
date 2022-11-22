# WEBSOCK-LT: Utility library for websocket (clients only)

This library provides a very simple API to open and use a websocket connection for clients. It provides a reconnection logic and sending function.

```
npm run build
```

or

```
yarn build
```

to bundle your application.


## To watch

```
npm run watch
```


## Example

```javascript
import {start_ws, send_ws_msg} from 'websock-lt'

const port = 9000;
start_ws(port, ((new_data) => {
    console.log("New data coming from WS", new_data);

    send_ws_msg({
        msg: "Msg to send via websocket"
    });
}));
```