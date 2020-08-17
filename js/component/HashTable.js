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

HashTable.prototype.getKey = function(key,index){
    if(key === "")
    {
        for(var i = 0;i<this.data.length;i++)
            {
                if(this.data.isFilter){
                    if(this.data[i].isFilter === true)
                        this.data[i].visiable = true;
                    else
                        this.data[i].visiable = false;
                }else
                    if(this.data[i].isFilter === undefined)
                        this.data[i].visiable = true;
                    else
                        this.data[i].visiable = false;
                    this.data[i].isSearch = undefined;
            }
            this.data.isSearch = undefined;
        return;
    }
    var check = []; 
    this.data.updateVisible = true;
    var rowElement,objectElement;
    this.data.isSearch = true;
    for(var i = 0;i<key.length;i++){
        var arrCharacter = this.hash[key[i].toLocaleLowerCase()];
        Loop1: for(var row in arrCharacter)
        {
            if(index===undefined)
            rowElement = arrCharacter[row];
            else if(arrCharacter[row][index]!==undefined)
            rowElement = [arrCharacter[row][index]];
            else
            continue;
            if(check[row]===undefined)
                check[row] = [];
            Loop2: for(var column in rowElement)
            {
                if(check[row][column]===undefined&&i!==0)
                {
                    continue;
                }
                    
                objectElement = rowElement[column];
                if(Array.isArray(objectElement))
                for(var j = 0;j<objectElement.length;j++)
                {
                        if(check[row][column]===undefined){
                                check[row][column] =  objectElement[j];
                                check[row][column].indexCharacter = key.length-1;
                                check[row][column].lastCheck = [objectElement];
                                check[row][column].lastIndexCheck = [];
                                check[row][column].lastIndex = objectElement[j][0];
                                var temp = key.length - (objectElement[j][0]+"").length;
                                var tempString = "";
                                for(var x = 0;x<temp;x++)
                                tempString+="0";
                                check[row][column].tempExactly = parseFloat("0."+tempString+objectElement[j][0]);
                        }
                        else {
                            if(objectElement[j][0]>check[row][column][0])
                            {
                                if(check[row][column].indexCharacter!==key.length-i)
                                {
                                    delete check[row][column];
                                    continue Loop2;
                                }else
                                {
                                    var prevCheck = objectElement[j][0];
                                 
                                    var currentIndex = check[row][column][0];
                                    var tempIndex = check[row][column].indexCharacter;
                                    var tempExactly = check[row][column].tempExactly + (prevCheck - currentIndex);
                                    var lastCheck = check[row][column].lastCheck;
                                    var lastIndexCheck =  check[row][column].lastIndexCheck;
                                    // prevCheck = currentIndex;
                                    for(var m=lastIndexCheck.length-1;m>=0;m--)
                                    {
                                        var itemCheck = lastCheck[m+1];
                                        var itemIndexCheck = 1;
                                        var lastIndex = lastIndexCheck[m];
                                        var oldIndex = lastIndexCheck[m];
                                        
                                        for(var n = itemIndexCheck;n<itemCheck.length;n++)
                                        {
                                            if(itemCheck[n][0]>prevCheck)
                                            break;
                                            lastIndex = itemCheck[n][0];
                                        }
                                        prevCheck = lastIndex;
                                        if(lastIndex-oldIndex>0)
                                        {
                                            tempExactly -= (lastIndex-oldIndex);
                                            lastIndexCheck[m] = lastIndex;
                                            if(m==lastIndexCheck.length-1)
                                            {
                                                var temp = key.length - (lastIndex+"").length;
                                                var tempString = "";
                                                for(var x = 0;x<temp;x++)
                                                tempString+="0";
                                                tempExactly = parseInt(tempExactly) + parseFloat("0."+tempString+lastIndex);
                                            }
                                        }
                                        else
                                        break;
                                    }
                                    
                                    lastCheck.unshift(objectElement);
                                    lastIndexCheck.unshift(check[row][column].lastIndex);
                                    
                                    check[row][column] = objectElement[j];
                                    
                                    check[row][column].lastCheck = lastCheck;
                                    check[row][column].lastIndexCheck = lastIndexCheck;
                                    check[row][column].lastIndex = objectElement[j][0];

                                    check[row][column].indexCharacter = tempIndex-1;
                                    check[row][column].tempExactly = tempExactly;
                                }
                            }else
                            {
                                continue;
                            }
                            
                        }
                        if(check[row][column].indexCharacter==0){
                            var arrParent = row.split("_");
                            var k = 0;
                            var stringCheck = arrParent[k];
                            while(k<arrParent.length)
                            {
                                if(this.data.isFilter){
                                    if(check[stringCheck][column][1].isFilter === true)
                                    {
                                        check[stringCheck][column][1].confirm = true;
                                        if(check[stringCheck][column][1].exactly===undefined)
                                        check[stringCheck][column][1].exactly = check[stringCheck][column].tempExactly;
                                        else if(check[stringCheck][column][1].exactly>check[stringCheck][column].tempExactly)
                                        check[stringCheck][column][1].exactly = check[stringCheck][column].tempExactly;
                                    }
                                    else
                                        check[stringCheck][column][1].confirm = undefined;
                                }else
                                {
                                    if(check[stringCheck][column][1].isFilter === undefined)
                                    {
                                        check[stringCheck][column][1].confirm = true;
                                        if(check[stringCheck][column][1].exactly===undefined)
                                        check[stringCheck][column][1].exactly = check[stringCheck][column].tempExactly;
                                        else if(check[stringCheck][column][1].exactly>check[stringCheck][column].tempExactly)
                                        check[stringCheck][column][1].exactly = check[stringCheck][column].tempExactly;
                                    }
                                    else
                                        check[stringCheck][column][1].confirm = undefined;
                                }
                                    

                                check[stringCheck][column][1].isSearch = true;
                                stringCheck+="_"+arrParent[k++];
                            }
                            continue Loop1;

                        }else
                        {
                            objectElement[j][1].isSearch = undefined;
                            objectElement[j][1].confirm = undefined;
                            continue Loop2;
                        }
                }
            }
        }
    }
}
