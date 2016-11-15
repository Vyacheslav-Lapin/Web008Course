"use strict";

const a = {
    field: 1,
    field2: 10,
    method1: () => console.log(1),
    method2: function () {
        console.log(this.field + this.field2);
    },
};

// a.method1();
// a.method2();

const B = (function () {

    class B {
        constructor() {
            this.field3 = 50;
        }

        method3(x) {
            return this.field3 + x;
        }
    }

    let b;

    return function () {
        if (b === undefined)
            b = new B();
        return b;
    };

})();

const b = new B();
const b1 = new B();
// console.log(b.method3(5));
// // ...
// console.log(b === b1); // true

const C = (() => {

    let constructorAvailable = false;

    class C {
        constructor() {

            if (!constructorAvailable)
                throw "Ошибка! Попытка вызвать извне приватный конструктор!";

            this.field1 = 3;
            this.field2 = 5;
        }

        method() {
            return this.field1 + this.field2;
        }

        /**
         * @param {C} c
         * @return {boolean}
         */
        equals(c) {
            return this.field1 === c.field1 &&
                this.field2 === c.field2 &&
                this.method() === c.method();
        }

        static getC() {
            constructorAvailable = true;
            try {
                return new D();
            } finally {
                constructorAvailable = false;
            }
        }
    }

    class D extends C {
        method2() {
            return 10 + this.method();
        }
    }

    return C;
})();

const c = C.getC();
const c1 = C.getC();

// console.log(c === c1); // false
// console.log(c.equals(c1)); // true
// console.log(c instanceof C); // true
// console.log(c1 instanceof C); //true
// console.log(C.name); //C

/**
 * @template T
 * @param {T} args...
 * @constructor
 */
class ArrayIterator {
    constructor(...args) {
        this.array = args;
    }

    /**
     * @param {function(T)} doWith
     */
    forEach(doWith) {
        let index = 0;
        while (index < this.array.length)
            doWith(this.array[index++]);
    }

    /**
     * @template U
     * @param {function(T):U} transformer
     * @returns ArrayIterator<U>
     */
    map(transformer) {
        const result = new ArrayIterator();
        const array = [];

        this.forEach(iteratorElement => array.push(transformer(iteratorElement)));

        result.array = array;
        return result;
    };

    /**
     * @template U
     * @param {function(T):boolean} filter
     * @returns ArrayIterator<U>
     */
    filter(filter) {
        const result = new ArrayIterator();
        const array = [];

        this.forEach(iteratorElement => {
            if (filter(iteratorElement))
                array.push(iteratorElement);
        });

        result.array = array;
        return result;
    };

    /**
     * @template U
     * @param {function(T):Array<U>} transformer
     * @returns ArrayIterator<U>
     */
    flatMap(transformer) {
        const result = new ArrayIterator();
        const array = [];

        this.forEach(iteratorElement => array.push.apply(array, transformer(iteratorElement)));

        result.array = array;
        return result;
    };

    /**
     * @template U
     * @param {U} initValue
     * @param {function(U, T): U} reducer
     */
    reduce(initValue, reducer) {
        let result = initValue;

        this.forEach(iteratorElement => result = reducer(result, iteratorElement));

        return result;
    };
}

const iterator = new ArrayIterator(1, 2, 3);

// console.log(
// iterator
//     .filter(x => x % 2 !== 0)
//     .map(x => x + 1)
//     .flatMap(x => [x - 1, x, x + 1])
//     .forEach(iteratorElement => console.log(iteratorElement)); // 1, 2, 3, 3, 4, 5
// // .reduce(0, (x, y) => x + y));

function* foo(/* args */) {
    /* some logic */
    yield 'bar one';
    /* some logic */
    yield 'bar two';
    /* some logic */
    yield 'bar three';
}

// for (let foobar of foo())
//     console.log(foobar);
//
// let fibonacci = {
//     *[Symbol.iterator]() {
//         let pre = 0, cur = 1;
//         while (true) {
//             [ pre, cur ] = [ cur, pre + cur ];
//             yield cur;
//         }
//     }
// };
//
// for (let n of fibonacci) {
//     if (n > 1000)
//         break;
//     console.log(n)
// }

class Sale {
    constructor(price) {
        this.price = price || 100;
    }

    getPrice() {
        return this.price;
    };

    decorate(decorator) {
        return Object.create(this, {
            getPrice: {
                value: this.constructor.decorators[decorator]['getPrice']
            }
        });
    };
}

Sale.decorators = {
    fedtax: {
        getPrice: function () {
            return Object.getPrototypeOf(this).getPrice() * 1.05;
        }
    },
    quebec: {
        getPrice: function () {
            return Object.getPrototypeOf(this).getPrice() * 1.075;
        }
    },
    money: {
        getPrice: function () {
            console.log(this);
            return `$ ${Object.getPrototypeOf(this).getPrice().toFixed(2)}`;
        }
    },
    // cdn: {
    //     getPrice: function () {
    //         return `CDN$ ${Object.getPrototypeOf(this).getPrice().toFixed(2)}`;
    //     }
    // }
};

let sale = new Sale(100); // цена 100 долларов
sale = sale.decorate(`fedtax`); // добавить федеральный налог
sale = sale.decorate(`quebec`); // добавить местный налог
sale = sale.decorate(`money`); // форматировать как денежную сумму
console.log(sale.getPrice());
