"use strict";

const a = {
    field: 1,
    field2: 10,
    method1: () => console.log(1),
    method2: function () {
        console.log(this.field + this.field2);
    },
};

a.method1();
a.method2();

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
console.log(b.method3(5));
// ...
console.log(b === b1); // true

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

console.log(c === c1); // false
console.log(c.equals(c1)); // true
console.log(c instanceof C); // true
console.log(c1 instanceof C); //true
console.log(C.name); //C

const iterator = {
    array: [1,2,3],
    index: 0,
    next: function () {
        return this.array[this.index++];
    },
    // remove: function () {
    //
    // }
};

let iteratorElement;
while ((iteratorElement = iterator.next()) !== undefined)
    console.log(iteratorElement); // 1, 2, 3
