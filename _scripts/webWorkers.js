"use strict";

const ww = new Worker(`/_scripts/myWebWorker.js`);
ww.onmessage = event => console.log(`message from the background thread: ${event.data}`);
