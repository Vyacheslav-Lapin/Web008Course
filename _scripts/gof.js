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
// // .reduce(0, (x, event1Listener1) => x + event1Listener1));

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
        this._price = price || 100;
        this.decorators = [];
    }

    get price() {
        return this.decorators
            .reduce((price, decorator) => Sale.decorators[decorator].getPrice(price), this._price);
    };

    decorate(decorator) {
        // todo: check existence in Sale.decorators
        this.decorators.push(decorator);
    };
}

Sale.decorators = {
    fedtax: {
        getPrice: function (prise) {
            return prise * 1.05;
        }
    },
    quebec: {
        getPrice: function (prise) {
            return prise * 1.075;
        }
    },
    money: {
        getPrice: function (prise) {
            return `$ ${prise.toFixed(2)}`;
        }
    },
    // cdn: {
    //     getPrice: function (prise) {
    //         return `CDN$ ${prise.toFixed(2)}`;
    //     }
    // }
};

const sale = new Sale(100); // цена 100 долларов
sale.decorate(`fedtax`); // добавить федеральный налог
sale.decorate(`quebec`); // добавить местный налог
sale.decorate(`money`); // форматировать как денежную сумму
// console.log(sale.price);

class Validator {
    constructor(config) {
        this.config = config;
        this.messages = [];
    }

    validate(data) {
        let type, checker, resultOk;

        // удалить все сообщения
        this.messages = [];
        Object.keys(data)
            .filter(key => data.hasOwnProperty(key))
            .forEach(key => {
                type = this.config[key];
                if (!type) return; // проверка не требуется
                checker = this.constructor.types[type];
                if (!checker) // ай-яй-яй
                    throw {
                        name: `ValidationError`,
                        message: `No handler to validate type ${type}`
                    };

                resultOk = checker.validate(data[key]);
                if (!resultOk)
                    this.messages.push(`Invalid value for * ${key} *, ${checker.instructions}`);
            });

        return this.hasErrors();
    }

    // вспомогательный метод
    hasErrors() {
        return this.messages.length !== 0;
    }
}

Validator.types = {
    // проверяет наличие значения
    isNonEmpty: {
        validate: function (value) {
            return value !== ``;
        },
        instructions: `the value cannot be empty`
    },
    isNumber: { // проверяет, является ли значение числом
        validate: function (value) {
            return !isNaN(value);
        },
        instructions: `the value can only be a valid number, e.g. 1, 3.14 or 2010`
    },
    isAlphaNum: { // проверяет, содержит ли значение только буквы и цифры
        validate: function (value) {
            return !/[^a-z0-9]/i.test(value);
        },
        instructions: `the value can only contain characters and numbers, no special symbols`
    }
};

const validator = new Validator({
    first_name: `isNonEmpty`,
    age: `isNumber`,
    username: `isAlphaNum`
});

// const validator = {
//     config: {
//         first_name: `isNonEmpty`,
//         age: `isNumber`,
//         username: `isAlphaNum`
//     },
//
//     messages: [],
//
//     validate: function (data) {
//         let i, msg, type, checker, resultOk;
//
//         // удалить все сообщения
//         this.messages = [];
//         for (i in data) {
//             if (data.hasOwnProperty(i)) {
//                 type = this.config[i];
//                 checker = this.types[type];
//                 if (!type) {
//                     continue; // проверка не требуется
//                 }
//                 if (!checker) { // ай-яй-яй
//                     throw {
//                         name: `ValidationError`,
//                         message: `No handler to validate type ${type}`
//                     };
//                 }
//                 resultOk = checker.validate(data[i]);
//                 if (!resultOk) {
//                     this.messages.push(`Invalid value for * ${i} *, ${checker.instructions}`);
//                 }
//             }
//         }
//         return this.hasErrors();
//     },
//
//     // вспомогательный метод
//     hasErrors: function () {
//         return this.messages.length !== 0;
//     },
//
//     types: {
//         isNonEmpty: { // проверяет наличие значения
//             validate: function (value) {
//                 return value !== ``;
//             },
//             instructions: `the value cannot be empty`
//         },
//         isNumber: { // проверяет, является ли значение числом
//             validate: function (value) {
//                 return !isNaN(value);
//             },
//             instructions: `the value can only be a valid number, e.g. 1, 3.14 or 2010`
//         },
//         isAlphaNum: { // проверяет, содержит ли значение только буквы и цифры
//             validate: function (value) {
//                 return !/[^a-z0-9]/i.test(value);
//             },
//             instructions: `the value can only contain characters and numbers, no special symbols`
//         }
//     }
// };

const data = {
    first_name: `Super`,
    last_name: `Man`,
    age: `unknown`,
    username: `o_O`
};

validator.validate(data);
if (validator.hasErrors()) {
    console.log(validator.messages.join(`\n`));
}
