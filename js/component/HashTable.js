export function HashTable(data) {

    this.hash = [];
    this.checkData = [];
    this.functionSetHash(data)
    this.data = data;
    return this;
}

HashTable.prototype.functionSetHash = function(data, dataParent = "") {
    var hash = this.hash;
    var checkData = this.checkData;
    var value;
    var object;
    var tempCharater = [];
    for (var m = 0; m < data.length; m++) {
        object = data[m];
        for (var i = 0; i < object.length; i++) {
            if (object[i].value !== undefined)
                value = object[i].value;
            else if (typeof object[i] === "string")
                value = object[i];
            else
                value = "";
            var stringCheck = m + dataParent;
            for (var j = 0; j < value.length; j++) {
                tempCharater = value[j].toLocaleLowerCase();
                if (hash[tempCharater] === undefined) {
                    hash[tempCharater] = [];
                }
                if (hash[tempCharater][stringCheck] == undefined)
                    hash[tempCharater][stringCheck] = [];
                if (hash[tempCharater][stringCheck][i] === undefined)
                    hash[tempCharater][stringCheck][i] = [];
                hash[tempCharater][stringCheck][i].push(j);
            }
            if (data[m].getRowMerge)
                checkData[stringCheck] = data[m].getRowMerge;
            else
                checkData[stringCheck] = [data[m]];
        }
        if (data[m].child !== undefined) {
            this.functionSetHash(data[m].child, "_" + m + dataParent);
        }
    }

}

HashTable.prototype.hashVisiableAll = function(arr, isFilter) {
    arr.sort(function(a, b) {
        if (a.oldIndex === undefined) {
            if (b.oldIndex === undefined)
                return 0;
            return -1;
        }

        if (b.oldIndex === undefined)
            return 1;

        if (a.oldIndex < b.oldIndex) {
            return -1;
        }
        if (a.oldIndex > b.oldIndex) {
            return 1;
        }
        return 0;
    })
    for (var i = 0; i < arr.length; i++) {
        if (isFilter) {
            if (arr[i].isFilter === true)
                arr[i].visiable = true;
            else
                arr[i].visiable = false;
        } else
        if (arr[i].isFilter === undefined)
            arr[i].visiable = true;
        else
            arr[i].visiable = false;
        arr[i].isSearch = undefined;
        if (arr[i].child && arr[i].child.length > 0) {
            this.hashVisiableAll(arr[i].child, isFilter)
        }
    }
}

HashTable.prototype.getKey = function(key, index) {
    key = key.trim();
    if (key === "") {
        this.hashVisiableAll(this.data, this.data.isFilter)
        this.data.isSearch = undefined;
        return;
    }
    var check = [];
    this.data.updateVisible = true;
    var rowElement, objectElement;
    this.data.isSearch = true;
    for (var i = 0; i < key.length; i++) {
        var arrCharacter = this.hash[key[i].toLocaleLowerCase()];
        Loop1: for (var row in arrCharacter) {
            if (index === undefined)
                rowElement = arrCharacter[row];
            else if (arrCharacter[row][index] !== undefined)
                rowElement = [arrCharacter[row][index]];
            else
                continue;
            if (check[row] === undefined)
                check[row] = [];
            Loop2: for (var column in rowElement) {
                if (check[row][column] === undefined && i !== 0) {
                    continue;
                }

                objectElement = rowElement[column];
                if (Array.isArray(objectElement))
                    for (var j = 0; j < objectElement.length; j++) {
                        if (check[row][column] === undefined) {
                            check[row][column] = { index: objectElement[j] };
                            check[row][column].indexCharacter = key.length - 1;
                            check[row][column].lastCheck = [objectElement];
                            check[row][column].lastIndexCheck = [];
                            check[row][column].lastIndex = objectElement[j];
                            var temp = key.length - (objectElement[j] + "").length;
                            var tempString = "";
                            for (var x = 0; x < temp; x++)
                                tempString += "0";
                            check[row][column].tempExactly = parseFloat("0." + tempString + objectElement[j]);
                        } else {
                            if (objectElement[j] > check[row][column].index) {
                                if (check[row][column].indexCharacter !== key.length - i) {
                                    delete check[row][column];
                                    continue Loop2;
                                } else {
                                    var prevCheck = objectElement[j];

                                    var currentIndex = check[row][column].index;
                                    var tempIndex = check[row][column].indexCharacter;
                                    var tempExactly = check[row][column].tempExactly + (prevCheck - currentIndex);
                                    var lastCheck = check[row][column].lastCheck;
                                    var lastIndexCheck = check[row][column].lastIndexCheck;
                                    // prevCheck = currentIndex;
                                    var tempDistance = 0;
                                    for (var m = lastIndexCheck.length - 1; m >= 0; m--) {
                                        var itemCheck = lastCheck[m + 1];
                                        var itemIndexCheck = 1;
                                        var lastIndex = lastIndexCheck[m];
                                        var oldIndex = lastIndexCheck[m];

                                        for (var n = itemIndexCheck; n < itemCheck.length; n++) {
                                            if (itemCheck[n] > prevCheck)
                                                break;
                                            lastIndex = itemCheck[n];
                                        }
                                        prevCheck = lastIndex;
                                        if (lastIndex - oldIndex > 0) {
                                            tempExactly -= ((lastIndex - oldIndex) - tempDistance);
                                            tempDistance += (lastIndex - oldIndex);
                                            lastIndexCheck[m] = lastIndex;
                                            if (m == lastIndexCheck.length - 1) {
                                                var temp = key.length - (lastIndex + "").length;
                                                var tempString = "";
                                                for (var x = 0; x < temp; x++)
                                                    tempString += "0";
                                                tempExactly = parseInt(tempExactly) + parseFloat("0." + tempString + lastIndex);
                                            }
                                        } else
                                            break;
                                    }

                                    lastCheck.unshift(objectElement);
                                    lastIndexCheck.unshift(check[row][column].lastIndex);

                                    check[row][column] = { index: objectElement[j] };

                                    check[row][column].lastCheck = lastCheck;
                                    check[row][column].lastIndexCheck = lastIndexCheck;
                                    check[row][column].lastIndex = objectElement[j];

                                    check[row][column].indexCharacter = tempIndex - 1;
                                    check[row][column].tempExactly = tempExactly;
                                }
                            } else {
                                continue;
                            }

                        }
                        if (check[row][column].indexCharacter == 0) {
                            var arrParent = row.split("_");
                            var k = arrParent.length - 1;
                            var stringCheck = arrParent[k];
                            var charCode = stringCheck.charCodeAt(0);
                            while (k >= 0) {
                                if (this.data.isFilter) {
                                    var object = this.checkData[stringCheck];
                                    for (var l = 0; l < object.length; l++) {
                                        if (object[l].isFilter === true) {
                                            object[l].confirm = true;
                                            object[l].isComplete = true;
                                            var tempExactly = check[row][column].tempExactly + charCode / 1000000000;
                                            if (object[l].exactly === undefined)
                                                object[l].exactly = tempExactly;
                                            else if (object[l].exactly > tempExactly)
                                                object[l].exactly = tempExactly;
                                        } else
                                            object[l].confirm = undefined;
                                    }
                                } else {
                                    var object = this.checkData[stringCheck];
                                    for (var l = 0; l < object.length; l++) {
                                        if (object[l].isFilter === undefined) {
                                            object[l].confirm = true;
                                            object[l].isComplete = true;
                                            var tempExactly = check[row][column].tempExactly + charCode / 1000000000;
                                            if (object[l].exactly === undefined)
                                                object[l].exactly = tempExactly;
                                            else if (object[l].exactly > tempExactly)
                                                object[l].exactly = tempExactly;
                                        } else
                                            object[l].confirm = undefined;
                                    }
                                }
                                var object = this.checkData[stringCheck];
                                for (var l = 0; l < object.length; l++) {
                                    object[l].isSearch = true;
                                }
                                charCode += arrParent[k].charCodeAt(0);
                                stringCheck = arrParent[--k] + "_" + stringCheck;
                            }
                            continue Loop1;

                        } else {
                            var object = this.checkData[row];
                            for (var l = 0; l < object.length; l++) {
                                if (object[l].isComplete !== true) {
                                    object[l].isSearch = undefined;
                                    object[l].confirm = undefined;
                                }
                            }
                            continue Loop2;
                        }
                    }
            }
        }
    }
}