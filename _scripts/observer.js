const publisher = {

    subscribers: {
        any: [] // тип события: подписчик
    },

    subscribe: function (fn, type = `any`) {
        if (typeof this.subscribers[type] === `undefined`)
            this.subscribers[type] = [];
        this.subscribers[type].push(fn);
    },

    unsubscribe: function (fn, type = `any`) {
        // this.visitSubscribers(`unsubscribe`, fn, type);

        const subscribers = this.subscribers[type];
        subscribers.splice(subscribers.indexOf(fn), 1);
    },

    publish: function (publication, type) {
        this.visitSubscribers(publication, type);
    },

    visitSubscribers: function (arg, type = `any`) {
        const subscribers = this.subscribers[type],
            max = subscribers.length;
        for (let i = 0; i < max;)
            subscribers[i++](arg);
    }
};

const paper = {
    daily: function () {
        this.publish(`big news today`);
    },
    monthly: function () {
        this.publish(`interesting analysis`, `monthly`);
    }
};

Object.assign(paper, publisher);

const joe = {
    drinkCoffee: paper => console.log(`Just read ${paper}`),
    sundayPreNap: monthly => console.log(`About to fall asleep reading this ${monthly}`),
};

paper.subscribe(joe.drinkCoffee);
paper.subscribe(joe.sundayPreNap, `monthly`);

paper.daily(); // Just read big news today
paper.daily(); // Just read big news today
paper.daily(); // Just read big news today
paper.monthly(); // About to fall asleep reading this interesting analysis
