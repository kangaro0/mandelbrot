"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class List {
    constructor(l) {
        this.arr = new Array(l);
    }
    get(i) {
        return this.arr[i];
    }
    getById(id) {
        let l = this.arr.length;
        for (let i = 0; i < l; i++)
            if (this.arr[i].id.localeCompare(id) === 0)
                return this.arr[i];
        return null;
    }
    set(i, v) {
        this.arr[i] = v;
    }
    push(v) {
        this.arr.push(v);
    }
    removeById(id) {
        let l = this.arr.length;
        for (let i = 0; i < l; i++)
            if (this.arr[i].id.localeCompare(id) === 0)
                this.arr.splice(i, 1);
    }
}
exports.List = List;
