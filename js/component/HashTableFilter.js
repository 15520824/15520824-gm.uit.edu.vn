export function HashTableFilter(data) {
  
    this.hash = [];
    this.data = data;
    this.check = [];
    this.functionSetHash(data);
    this.indexCount = [];
    this.lastIndex = [];
    this.lastKey = [];
    this.lastIndexFilter = [];
    return this;
}

HashTableFilter.prototype.functionSetHash = function(data,dataParent = "")
{
    var hash = this.hash;
    var value;
    var object;
    for(var m = 0;m<data.length;m++){
        object = data[m];
        var stringCheck = m+dataParent;
        if(this.check[stringCheck] == undefined){
            this.check[stringCheck] = [];
            this.check[stringCheck].data = data[m];
        }

        for(var i = 0;i<object.length;i++){
             if (object[i].value !== undefined)
                value = object[i].value;
            else if (typeof object[i] === "string")
                value = object[i];
            else
                value = "";
            if(Array.isArray(value))
            {
                for(var j=0;j<value.length;j++)
                {
                    if(hash[i]===undefined)
                        hash[i] = [];
                    if( hash[i][value[j]]===undefined)
                        hash[i][value[j]] = [];
                    hash[i][value[j]].push(stringCheck);
                }
            }else
            {
                if(hash[i]===undefined)
                    hash[i] = [];
                if( hash[i][value]===undefined)
                    hash[i][value] = [];
                hash[i][value].push(stringCheck);
            }
           

            if(data[m].child!==undefined)
            {
                this.functionSetHash(data[m].child,"_"+m+dataParent);
            }
        }
       
    }
}

HashTableFilter.prototype.getKey = function(key,index){
    var hash = this.hash;

    this.lastKey[index] = key;
    if(key == 0)
    {
        if(this.lastIndex[index]!==undefined)
            for(var i = 0;i<this.lastIndex[index].length;i++)
                this.lastIndex[index][i][index] = undefined;
        delete this.indexCount[index];
        var countAll = this.indexCount.reduce((a,b) => a + b, 0);

        if(countAll>0)
        {
            for(var tempx in this.indexCount)
            {
                index = parseInt(tempx);
                key = this.lastKey[index];
                break;
            }
        }else
        {
            for(var i = 0;i<this.data.length;i++)
            {
                if(this.data.isSearch){
                    if(this.data[i].isSearch === true)
                        this.data[i].visiable = true;
                }else
                    if(this.data[i].isSearch === undefined)
                        this.data[i].visiable = true;

                this.data[i].isFilter = undefined;
            }
            this.data.isFilter =  undefined;
            return;
        }
        
    }
    this.data.updateVisible = true;
    this.indexCount[index] = 1;
    this.data.isFilter = true;
    
    var countAll = this.indexCount.reduce((a,b) => a + b, 0);
    if(this.lastIndex[index]!==undefined)
        for(var i = 0;i<this.lastIndex[index].length;i++)
            this.lastIndex[index][i][index] = undefined;
        this.lastIndex[index] = [];
   
    for(var i=0;i<this.lastIndexFilter.length;i++)
    {
        this.lastIndexFilter[i].isFilter = undefined;
    }
    this.lastIndexFilter = [];
    if(hash[index][key]!==undefined)
        for(var i = 0;i<hash[index][key].length;i++){
            var checkRow = this.check[hash[index][key][i]];

            checkRow[index] = true;
            this.lastIndex[index].push(checkRow);
            var countIn = 0
            for(var param in checkRow)
            {   
                if(checkRow[param] === true){
                    countIn++;
                }   
            }
            if(countIn==countAll){
                if(this.data.isSearch){
                    if(checkRow.data.isSearch === true)
                        checkRow.data.confirm = true;
                }else
                    if(checkRow.data.isSearch === undefined)
                        checkRow.data.confirm = true;
                this.lastIndexFilter.push(checkRow);
                checkRow.data.isFilter = true;
            }
            else{
                checkRow.data.isFilter = undefined;
                checkRow.data.confirm = undefined;
            }
        }
}
