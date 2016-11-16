class Player {
    constructor(name) {
        this.points = 0;
        this.name = name;
    }

    play() {
        this.points++;
        mediator.played();
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
                msg += `<p><strong>${i}<\/strong>: ${score[i]}<\/p>`;
        }
        this.element.innerHTML = msg;
    }
};

const mediator = {

    // все игроки
    players: {},

    // инициализация
    setup: function () {
        const players = this.players;
        players.home = new Player(`Home`);
        players.guest = new Player(`Guest`);
        addEventListener('keypress', this.keypress, true);
        setTimeout(() => { // Игра завершится через 30 секунд
            removeEventListener('keypress', mediator.keypress, true);
            alert(`Game over!`);
        }, 3000);
    },

    // обновляет счет, если кто-то из игроков сделал ход
    played: function () {
        const players = this.players,
            score = {
                Home: players.home.points,
                Guest: players.guest.points
            };
        scoreBoard.update(score);
    },

    // обработчик действий пользователя
    keypress: function (e) {
        if (e.which === 49) // key “1”
            mediator.players.home.play();
        else if (e.which === 48) // key “0”
            mediator.players.guest.play();
    }
};

// Старт!
mediator.setup();
