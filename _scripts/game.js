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
        addEventListener('keyPress', this.keypress, true);
        setTimeout(() => {
            removeEventListener('keyPress', this.keypress, true);
            alert(`Game over!`);
        }, 10000); // Игра завершится через 10 секунд
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
        const keyCode = e.which,
            userName = keyCode === 49 ? `home` : // key “1”
                keyCode === 48 ? `guest` : // key “0”
                    undefined;
        if (userName)
            mediator.players[userName].play();
    }
};

mediator.setup(); // Старт!
