!function(e,o){"object"==typeof exports&&"object"==typeof module?module.exports=o():"function"==typeof define&&define.amd?define([],o):"object"==typeof exports?exports["websock-lt"]=o():e["websock-lt"]=o()}(self,(()=>(()=>{"use strict";var e={d:(o,n)=>{for(var t in n)e.o(n,t)&&!e.o(o,t)&&Object.defineProperty(o,t,{enumerable:!0,get:n[t]})},o:(e,o)=>Object.prototype.hasOwnProperty.call(e,o),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},o={};e.r(o),e.d(o,{send_ws_msg:()=>t,start_ws:()=>n});const n=function(e,o){return e=e||"6789",new Promise((n=>{try{i(e,o,n)}catch(e){n()}}))},t=function(e){if(!(r||{}).readyState)return s||console.warn("No WS Connection available: No color sent"),void(s=!0);let o=JSON.stringify(e);c._DEBUG_&&console.info("MSG",o),r.send(o)};let r=null,l=null;const c=window.CONFIG||{};function i(e,o,n){console.info("Connecting to websocket..."),r=new WebSocket("ws://localhost:"+e),r.addEventListener("open",(function(){console.info("WebSocket Client Connected"),r.addEventListener("message",(function(e){let n=e.utf8Data||e.data;c._DEBUG_&&console.log("Received: '"+n+"'"),o&&o(JSON.parse(n))})),n&&n(r)})),r.addEventListener("error",(function(e){c._DEBUG_&&console.log("Connection Error: "+e.toString()),r=null,n&&n()})),r.addEventListener("close",(function(){console.warn("Websocket Connection Closed"),r=null,l||(l=setInterval((()=>{if(r)return clearInterval(l),void(l=null);i(e,o,n)}),3e3))}))}let s=!1;return o})()));