export function HashTableFilter(data,index = 0) {
  
    this.hash = [];
    this.data = data;
    this.index = index;
    this.functionSetHash(data,index);
    return this;
}

HashTableFilter.prototype.functionSetHash = function(data,index,dataParent="")
{
    var hash = this.hash;
    var value;
    var object;

    for(var m = 0;m<data.length;m++){
        object = data[m];
        data[m].updateSearch = function(){

        }

        if (object[index].value !== undefined)
            value = object[index].value;
        else if (typeof object[index] === "string")
            value = object[index];
        else
            value = "";

        var stringCheck = m + dataParent;
        hash[stringCheck] = data[m];
        
        if(data[m].child!==undefined)
        {
            this.functionSetHash(data[m].child,index,"_"+m+dataParent);
        }
    }

}

HashTableFilter.prototype.getKey = function(key){
    var hash = this.hash;
    this.data.updateVisible;
   for(var param in hash)
   {
       if(hash[param] === key)
       {
           hash[param].confirm = true;
       }
   }
}
