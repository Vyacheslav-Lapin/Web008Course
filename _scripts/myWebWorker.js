"use strict";

let end = 1e8, tmp = 1;

postMessage(`hello there`);

while (end--) {
    tmp += end;
    if (end === 5e7) // число 5e7 – половина числа 1e8
        postMessage(`halfway there, ${tmp} is now ${tmp}`);
}

postMessage(`all done`);
