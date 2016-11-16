"use strict";

class Player {
    constructor(name, key) {
        this.points = 0;
        this.name = name;
        this.key = key;
        this.fire(`newPlayer`, this);
    }

    play() {
        this.points++;
        this.fire(`play`, this);
    }
}

const scoreBoard = {

    // элемент HTML, который должен обновляться
    element: document.getElementById("results"),

    // обновляет счет на экране
    update: function (score) {
        let i, msg = '';
        for (i in score) {
            if (score.hasOwnProperty(i))
                msg += `<p><strong>${i}</strong>: ${score[i]}</p>`;
        }
        this.element.innerHTML = msg;
    }
};

const game = {

    /**
     * все ключи
     * @type *<number, Player>
     */
    keys: {},

    addPlayer: function (player) {
        const key = player.key.toString().charCodeAt(0);
        this.keys[key] = player;
    },

    handleKeyPress: function (e) {
        const player = game.keys[e.which];
        if (player)
            player.play();
    },

    handlePlay: function (player) {
        const players = this.keys,
            score = {};
        for (let i in players)
            if (players.hasOwnProperty(i))
                score[players[i].name] = players[i].points;
        this.fire(`scoreChange`, score);
    },
};

const publisher = {

    subscribers: {
        any: []
    },

    on: function (type = `any`, callBack, context) {
        callBack = typeof callBack === `function` ? callBack : context[callBack];
        if (typeof this.subscribers[type] === `undefined`)
            this.subscribers[type] = [];
        this.subscribers[type].push({fn: callBack, context: context || this});
    },

    remove: function (type = `any`, callBack, context) {
        callBack = typeof callBack === `function` ? callBack : context[callBack];
        const subscribers = this.subscribers[type];
        let index = -1;
        subscribers
            .forEach((subscriber, i) => {
                if (subscriber.fn === callBack)
                    index = i
            });

        if (index !== -1 )
            subscribers.splice(index, 1);
    },

    fire: function (type = `any`, publication) {
        this.visitSubscribers(type, publication);
    },

    visitSubscribers: function (type = `any`, arg, context) {
        this.subscribers[type]
            .forEach(subscriber => subscriber.fn.call(subscriber.context, arg));
    }
};

Object.assign(Player.prototype, publisher);
Object.assign(game, publisher);

// game.setup(); // Старт!
Player.prototype.on(`newPlayer`, `addPlayer`, game);
Player.prototype.on(`play`, `handlePlay`, game);
game.on(`scoreChange`, scoreBoard.update, scoreBoard);
window.onkeypress = game.handleKeyPress;

let playerName, key;
while (1) {
    playerName = prompt(`Add player (name)`);
    if (!playerName) break;
    while (1) {
        key = prompt(`Key for ${playerName}?`);
        if (key) break;
    }
    new Player(playerName, key);
}
