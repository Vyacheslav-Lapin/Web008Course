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

const B = (function() {

    class B {
        constructor() {
            this.field3 = 50;
        }
        method3(x) {
            return this.field3 + x;
        }
    }

    let b;

    return function() {
        if (b === undefined)
            b = new B();
        return b;
    };

})();

const b = new B();
const c = new B();
console.log(b.method3(5));
// ...
console.log(b === c); // true

class C {
    constructor() {
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
        return new D();
    }
}

class D extends C {
    method2() {
        return 10 + this.method();
    }
}

const c = new C();
const c1 = C.getC();

console.log(c === c1); // false
console.log(c.equals(c1)); // true
console.log(c instanceof C); // true
console.log(c1 instanceof C); //true