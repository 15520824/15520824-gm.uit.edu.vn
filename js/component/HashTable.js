export function HashTable(data) {
  
    this.hash = [];
    this.functionSetHash(data)
    this.data = data;
    return this;
}

HashTable.prototype.functionSetHash = function(data,dataParent="")
{
    var hash = this.hash;
    var value;
    var object;
    var k;
    var tempCharater = [];
    for(var m = 0;m<data.length;m++){
        object = data[m];
        data[m].updateSearch = function(){

        }
        for (var i = 0; i < object.length; i++) {
            if (object[i].value !== undefined)
                value = object[i].value;
            else if (typeof object[i] === "string")
                value = object[i];
            else
                value = "";
            for(var j = 0;j<value.length;j++)
            {
                tempCharater = value[j].toLocaleLowerCase();
                if(hash[tempCharater]===undefined)
                {
                    hash[tempCharater] = [];
                }
                var stringCheck = m+dataParent;
                if(hash[tempCharater][stringCheck] == undefined)
                        hash[tempCharater][stringCheck] = []; 
                if(hash[tempCharater][stringCheck][i]===undefined)
                    hash[tempCharater][stringCheck][i] = [];
                hash[tempCharater][stringCheck][i].push([j,data[m]]);
            }
        }
        if(data[m].child!==undefined)
        {
            this.functionSetHash(data[m].child,"_"+m+dataParent);
        }
    }

}

HashTable.prototype.getKey = function(key){
    if(key === "")
    {
        for(var i = 0;i<this.data.length;i++)
            this.data[i].visiable = undefined;
        return;
    }
    var check = []; 
    this.data.updateVisible = true;
    var rowElement,objectElement;

    for(var i = 0;i<key.length;i++){
        var arrCharacter = this.hash[key[i].toLocaleLowerCase()];
        Loop1: for(var row in arrCharacter)
        {
            rowElement = arrCharacter[row];
            if(check[row]===undefined)
                check[row] = [];
            Loop2: for(var column in rowElement)
            {
                    objectElement = rowElement[column];
                if(Array.isArray(objectElement))
                for(var j = 0;j<objectElement.length;j++)
                {
                    if(check[row][column]===undefined||(objectElement[j][0]>check[row][column][0])){
                        if(check[row][column]===undefined){
                            check[row][column] =  objectElement[j];
                            check[row][column].indexCharacter = key.length-1;
                        }
                        else{
                            var tempIndex = check[row][column].indexCharacter;
                            check[row][column] =  objectElement[j];
                            check[row][column].indexCharacter = tempIndex-1;
                        }
                        if(check[row][column].indexCharacter==0){
                            objectElement[j][1].confirm = true;
                            var arrParent = row.split("_");
                            var k = 0;
                            var stringCheck = arrParent[k];
                            while(k<arrParent.length)
                            {
                                for(var param in check[stringCheck]){
                                    check[stringCheck][param][1].confirm = true;
                                    break;
                                }
                                stringCheck+="_"+arrParent[k++];
                            }
                            continue Loop1;
                        }
                        continue Loop2;
                    }
                    else{
                        objectElement[j][1].confirm = false;
                        continue ;
                    }
                }
            }
        }
    }
}
