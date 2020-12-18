import { isVisiableColumn } from "./FormatFunction";

export function HashTableRange(data, id, index) {
    this.data = data;
    this.hash = [];
    this.indexCount = [];
    this.setUpKey(id, index);
    return this;
}

HashTableRange.prototype.setUpKey = function(id, index) {
    this.hash[id] = [index];
}

HashTableRange.prototype.hashVisiableAll = function(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (isVisiableColumn(this.data, arr[i], "isRange")) {
            arr[i].visiable = true;
        } else {
            arr[i].visiable = false;
        }
        arr[i].isRange = undefined;
        if (arr[i].child && arr[i].child.length > 0) {
            this.hashVisiableAll(arr[i].child)
        }
    }
}

HashTableRange.prototype.getKey = function(min, max, id) {
    if (min == this.hash[id][1] && max == this.hash[id][2])
        return;
    this.hash[id][1] = min;
    this.hash[id][2] = max;
    var index = this.hash[id][0];
    var value, object;
    this.data.isRange = true;
    this.data.updateVisible = true;
    Loop: for (var i = 0; i < this.data.length; i++) {
        var object = this.data[i][index];
        if (object.value !== undefined)
            value = object.value;
        else if (typeof object === "string")
            value = object;
        else
            value = "";
        if (this.indexCount[i] == undefined)
            this.indexCount[i] = [];
        if ((min === "" || min == undefined || min < value) && (max === "" || max == undefined || value < max)) {
            this.indexCount[i][id] = true;
        } else
            this.indexCount[i][id] = false;
        for (var param in this.hash) {
            if (this.indexCount[i][param] == false) {
                this.data[i].isRange = false;
                this.data[i].confirm = undefined;
                continue Loop;
            } else {
                this.data[i].isRange = true;
                if (isVisiableColumn(this.data, this.data[i], "isRange")) {
                    this.data[i].confirm = true;
                } else
                    this.data[i].confirm = undefined;
            }
        }
    }
}