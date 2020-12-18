import { isVisiableColumn } from './FormatFunction';
export function HashTableFilter(data) {
    this.hash = [];
    this.data = data;
    this.check = [];
    this.functionSetHash(data);
    this.indexCount = [];
    this.lastIndex = [];
    this.lastKey = [];
    this.lastIndexFilter = [];
    this.functionCheck = [];
    return this;
}

HashTableFilter.prototype.functionSetHash = function(data, dataParent = "") {
    var hash = this.hash;
    var value;
    var object;
    for (var m = 0; m < data.length; m++) {
        object = data[m];
        var stringCheck = m + dataParent;
        if (this.check[stringCheck] == undefined) {
            this.check[stringCheck] = [];
            this.check[stringCheck].data = object.getRowMerge;
        }

        for (var i = 0; i < object.length; i++) {
            if (object[i].value !== undefined)
                value = object[i].value;
            else if (typeof object[i] === "string")
                value = object[i];
            else
                value = "";
            if (Array.isArray(value)) {
                for (var j = 0; j < value.length; j++) {
                    if (hash[i] === undefined)
                        hash[i] = [];
                    if (hash[i][value[j]] === undefined)
                        hash[i][value[j]] = [];
                    hash[i][value[j]].push(stringCheck);
                }
            } else {
                if (hash[i] === undefined)
                    hash[i] = [];
                if (hash[i][value] === undefined)
                    hash[i][value] = [];
                hash[i][value].push(stringCheck);
            }


            if (data[m].child !== undefined) {
                this.functionSetHash(data[m].child, "_" + m + dataParent);
            }
        }

    }
}

HashTableFilter.prototype.hashVisiableAll = function(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (isVisiableColumn(this.data, arr[i], "isFilter")) {
            arr[i].visiable = true;
        } else {
            arr[i].visiable = false;
        }
        arr[i].isFilter = undefined;
        if (arr[i].child && arr[i].child.length > 0) {
            this.hashVisiableAll(arr[i].child)
        }
    }
}

HashTableFilter.prototype.getKey = function(key, index) {
    var hash = this.hash;

    this.lastKey[index] = key;
    if (key == 0) {
        if (this.lastIndex[index] !== undefined)
            for (var i = 0; i < this.lastIndex[index].length; i++)
                this.lastIndex[index][i][index] = undefined;
        delete this.indexCount[index];
        var countAll = this.indexCount.reduce((a, b) => a + b, 0);
        if (countAll > 0) {
            for (var tempx in this.indexCount) {
                index = parseInt(tempx);
                key = this.lastKey[index];
                break;
            }
        } else {
            this.hashVisiableAll(this.data);
            return;
        }

    }
    this.data.updateVisible = true;
    this.indexCount[index] = 1;
    this.data.isFilter = true;

    var countAll = this.indexCount.reduce((a, b) => a + b, 0);
    if (this.lastIndex[index] !== undefined)
        for (var i = 0; i < this.lastIndex[index].length; i++)
            this.lastIndex[index][i][index] = undefined;
    this.lastIndex[index] = [];

    for (var i = 0; i < this.lastIndexFilter.length; i++) {
        this.lastIndexFilter[i].isFilter = undefined;
    }
    this.lastIndexFilter = [];
    if (hash[index] !== undefined && hash[index][key] !== undefined)
        for (var i = 0; i < hash[index][key].length; i++) {
            var checkRow = this.check[hash[index][key][i]];

            checkRow[index] = true;
            this.lastIndex[index].push(checkRow);
            var countIn = 0
            for (var param in checkRow) {
                if (checkRow[param] === true) {
                    countIn++;
                }
            }
            if (countIn == countAll) {
                for (var k = 0; k < checkRow.data.length; k++) {
                    if (isVisiableColumn(this.data, checkRow.data[k], "isFilter") === true)
                        checkRow.data[k].confirm = true;
                    checkRow.data[k].isFilter = true;
                    checkRow.data[k].isComplete = true;
                }
                this.lastIndexFilter.push(checkRow);
            } else {
                for (var k = 0; k < checkRow.data.length; k++) {
                    if (checkRow.data[k].isComplete !== true) {
                        checkRow.data[k].isFilter = undefined;
                        checkRow.data[k].confirm = undefined;
                    }
                }
            }
        }
}