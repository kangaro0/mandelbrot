"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var List = (function () {
    function List(l) {
        this.arr = new Array(l);
    }
    List.prototype.get = function (i) {
        return this.arr[i];
    };
    List.prototype.getById = function (id) {
        var l = this.arr.length;
        for (var i = 0; i < l; i++)
            if (this.arr[i].id.localeCompare(id) === 0)
                return this.arr[i];
        return null;
    };
    List.prototype.push = function (p) {
        this.arr.push(p);
    };
    List.prototype.set = function (i, p) {
        this.arr[i] = p;
    };
    List.prototype.removeById = function (id) {
        console.log('removing');
        var l = this.arr.length;
        for (var i = 0; i < l; i++)
            if (this.arr[i].id.localeCompare(id) === 0)
                this.arr.splice(i, 1);
    };
    List.prototype.length = function () {
        return this.arr.length;
    };
    return List;
}());
exports.List = List;
//# sourceMappingURL=list.js.map