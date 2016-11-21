"use strict";

const $ = require('jquery');
const _ = require('underscore');

function timeline(user){
    this.setHeader = () =>{
        $("#timeline").text(user.name+ " Timeline");
    };

    this.setTimeline = function(){
        _.each(user.messages, msg =>{
            const html = "<li><div class='timeline-heading'><h4 class='timeline-title'>" + msg + "</h4></div></li>";
            $(".timeline").append(html);
        });
    }
}

module.exports = timeline;