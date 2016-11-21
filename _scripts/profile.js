"use strict";

const timeline = require('./timeline.js');
const user = {
    name: "Shekhar Gulati",
    messages: [
        "hello",
        "bye",
        "good night"
    ]
};

//noinspection JSPotentiallyInvalidConstructorUsage
const timelineModule = new timeline(user);
timelineModule.setHeader(user);
timelineModule.setTimeline(user);
