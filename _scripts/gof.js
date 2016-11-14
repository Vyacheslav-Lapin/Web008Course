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
