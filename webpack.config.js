"use strict";

module.exports = {
    context: __dirname,
    devtool: "source-map",
    entry: "./_scripts/profile.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    }
};
