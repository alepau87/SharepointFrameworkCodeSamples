"use strict";
var ComplexCalculator = (function () {
    function ComplexCalculator() {
    }
    ComplexCalculator.prototype.sqr = function (v1) {
        return v1 * v1;
    };
    ComplexCalculator.prototype.multiply = function (v1, v2) {
        return v1 * v2;
    };
    ComplexCalculator.prototype.sayHello3 = function () {
        return "Hello";
    };
    return ComplexCalculator;
}());
exports.ComplexCalculator = ComplexCalculator;

//# sourceMappingURL=ComplexCalculator.js.map
