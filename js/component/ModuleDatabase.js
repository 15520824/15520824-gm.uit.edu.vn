import FormClass from './jsform';


var moduleDatabase = new ModuleDatabase();
console.log(moduleDatabase)
function ModuleDatabase() {
    this.hostDatabase = "https://lab.daithangminh.vn/home_co/pizo/php/template/";
    this.data = [];
}

ModuleDatabase.prototype.getModule = function(name,listFilePHP,isCreated = false){
    if(isCreated==true||this.data[name]==undefined){
        this.data[name] = new DataStructure(this.hostDatabase,name,listFilePHP);
        return this.data[name];
    }else
    return this.data[name];
}

function DataStructure(hostDatabase ,name ,listFilePHP = ["load.php","add.php","update.php","delete.php"]){
   this.phpLoader = hostDatabase+listFilePHP[0];
   this.phpAdder = hostDatabase+listFilePHP[1];
   this.phpUpdater = hostDatabase+listFilePHP[2];
   this.phpDeleter = hostDatabase+listFilePHP[3];
   this.name = name;
   this.Libary = [];
   this.sync = [];
   this.checkLoaded = [];
   this.promisePart = [];
   this.isFirst = true;
}


DataStructure.prototype.load = function(data = [],isLoaded = false){
    var self = this;
    if(data.WHERE == undefined)
    {
        if(isLoaded == false&&self.promiseLoad!==undefined)
        {
            console.log(self.promiseLoad.status)
            if(self.promiseLoad.status==="pending")
            return self.promiseLoad;
            else
            return Promise.resolve(self.data);
        }
           
    }else
    {
        if(isLoaded == false&&self.promisePart[JSON.stringify(data.WHERE)]!==undefined)
        {
            if(self.promisePart[JSON.stringify(data.WHERE)].status==="pending")
            return self.promisePart[JSON.stringify(data.WHERE)];
            else
            return Promise.resolve(self.promisePart[JSON.stringify(data.WHERE)].data);
        }
    }

    var promiseLoad;
    
    if(this.isFirst === true&&data.WHERE!==undefined)
    {
        data.isFirst = true;
        this.isFirst = false;
    }
    promiseLoad = new Promise(function(resolve,reject){
        self.queryData(self.phpLoader,data).then(function(value){
            
            if(self.data === undefined)
            self.data = [];
            if(data.WHERE===undefined)
            {
                self.countRow = value.length;
            }else
            {
                self.checkLoaded[JSON.stringify(data.WHERE)] = value;
                if(data.isFirst===true)
                {
                    self.countRow = parseInt(value[value.length-1].count);
                    value.splice(value.length-1,1);
                }
            }
            var libary = self.Libary["id"];
            if(libary === undefined)
            {
                self.data = value;
            }else
            for(var i = 0;i<value.length;i++)
            {
                if(self.data.length === self.countRow)
                {
                    if(self.promiseLoad === undefined)
                    self.promiseLoad = Promise.resolve(self.data);
                    break;
                }
                if(libary[value[i].id]===undefined)
                {
                    self.data.push(value[i]);
                    self.setFormatAdd(value[i]);
                }
            }
            
            self.getLibary();
            promiseLoad.status = "done";
            promiseLoad.data = value;
            resolve(value);
    })
    .catch(function(error){
        promiseLoad.status = "reject";
        reject(error);
        console.error(error);
    })
    })
    promiseLoad.status = "pending";
    if(data.WHERE === undefined)
    self.promiseLoad = promiseLoad;
    else
    self.promisePart[JSON.stringify(data.WHERE)] = promiseLoad;

    return promiseLoad;
}

DataStructure.prototype.getLibary = function(param,formatFunction,isArray = false,isLoaded = false){
    if(formatFunction===undefined)
        formatFunction = function(data){
            return data;
        }
    if(param!==undefined){
        if(Array.isArray(param)===false)
        {
            param = [param];
        }else
            param = param;
    
        for(var j = 0;j<param.length;j++)
        {
            if(isLoaded === true||this.Libary[param] == undefined)
            {
                for(var i = 0;i<this.data.length;i++)
                {
                    this.setLibaryRow(this.data[i],param[j],formatFunction,isArray);
                }
            }
        }
        if(param.length == 1)
            return this.Libary[param[0]];
    }else
    {
        var isID = false;
        for(var param in this.Libary)
        {
            if(param === "id")
                isID = true;
            for(var i = 0;i<this.data.length;i++)
            {
                this.setLibaryRow(this.data[i],param,formatFunction,isArray);
            }
        }
        if(isID === false)
        {
            for(var i = 0;i<this.data.length;i++)
            {
                this.setLibaryRow(this.data[i],"id",formatFunction,isArray);
            }
        }
    }

    return this.Libary;
}

DataStructure.prototype.sync = function(element,functionSync){
    this.sync.push(element,functionSync);
}

DataStructure.prototype.setLibaryRow = function(data,param,formatFunction,isArray){
    if(this.Libary[param]===undefined){
        this.Libary[param] = [];
        this.Libary[param].isArray = isArray;
        this.Libary[param].formatFunction = function(data,param){
            var result = formatFunction(data);
            result.getData = function(){
                return data;
            };
            if(this[data[param]] == undefined||this[data[param]].index == 0){
                if(this.isArray == true)
                    this[data[param]] = [result];
                else
                this[data[param]] = result;
                this[data[param]].index = 0;
            }
            else 
            {
                if(this[data[param]].index == 1&&this.isArray!==true)
                {
                    if(this[data[param]].id == result.id)
                    return;
                    this[data[param]] = [this[data[param]]];
                }
                this[data[param]].push(result);
            }
            this[data[param]].index++;
        };
        this.Libary[param].deleteFunction = function(data,param){
            if(this[data[param]].index == 1&&this.isArray!==true)
            delete this[data[param]];
            else
            for(var i = 0;i<this[data[param]].length;i++){
                if(this[data[param]][i].getData() === data) 
                {
                    this[data[param]].splice(i,1);
                }
            }
            if(this[data[param]]!==undefined){
                this[data[param]].index--;
                if(this[data[param]].index == 1&&this.isArray!==true)
                this[data[param]] = this[data[param]][0];
            }
        }
    }
    this.Libary[param].formatFunction(data,param);
    data.getList = function(name,value){
        var text = "";
        for(var i = 0;i<name.length;i++){
            if(data[name]===undefined)
            text+=name[i];
            else
            text+= data[name[i]];
        }

        var checkvalue = "";
        var isFirst = "";
        for(var i = 0;i<value.length;i++){
            if(data[value[i]]===undefined)
            checkvalue+=value[i];
            else
            checkvalue+= isFirst+data[value[i]];
            isFirst = "_";
        }
        return {text:text,value:checkvalue};
    }
}

DataStructure.prototype.getList = function(param,value,skip){
    var result = [];
    if(skip==undefined)
    skip = function(){};
    if(Array.isArray(param)!=true){
        param = [param];
    }
    if(Array.isArray(value)!=true){
        value = [value];
    }
    for(var i = 0;i<this.data.length;i++)
    {
        if(skip(this.data[i]))
            continue;
        result.push(this.data[i].getList(param,value));
    }
    return result;
}

DataStructure.prototype.add = function(data){
    var self = this;
    return new Promise(function(resolve,reject){
        self.queryData(self.phpAdder,data).then(function(value){
                Object.assign(data,value.data);
                self.setFormatAdd(data);
                if(value.insert!==undefined)
                {
                    for(var i = 0;i<value.insert.length;i++)
                    {
                        for(var param in value.insert[i])
                        {
                            if(moduleDatabase.data[param]!==undefined)
                            {
                                moduleDatabase.data[param].setFormatAdd(value.insert[i][param]);
                            }
                        }
                    }
                }
                if(value.update!==undefined)
                {
                    for(var i = 0;i<value.update.length;i++)
                    {
                        for(var param in value.update[i])
                        {
                            if(moduleDatabase.data[param]!==undefined)
                            {
                                moduleDatabase.data[param].setFormatUpdate(value.update[i][param]);
                            }
                        }
                    }
                }

            resolve(value);
        }).catch(function(err){
            reject(err);
            console.error(err)
        })
    })
}

DataStructure.prototype.setFormatAdd = function(data)
{
    var self = this;
    if(self.Libary[data.id]!==undefined)
        return;
    for(var param in self.Libary)
    {
        if(typeof self.Libary[param]!= "function")
        self.Libary[param].formatFunction(data,param);
    }
    data.getList = function(name,value){
        var text = "";
        for(var i = 0;i<name.length;i++){
            if(data[name]===undefined)
            text+=name[i];
            else
            text+= data[name[i]];
        }

        var checkvalue = "";
        var isFirst = "";
        for(var i = 0;i<value.length;i++){
            if(data[value[i]]===undefined)
            checkvalue+=value[i];
            else
            checkvalue+= isFirst+data[value[i]];
            isFirst = "_";
        }
        return {text:text,value:checkvalue};
    }
    self.data.push(data);  
    self.countRow++;
}

DataStructure.prototype.update = function(data,needChange = false){
    var self = this;
    return new Promise(function(resolve,reject){
        self.queryData(self.phpUpdater,data).then(function(value){
            if(data.id!==undefined)
            {
                Object.assign(data,value.data);
                if(needChange === true)
                {
                    data.add = Object.assign({}, value.add);
                    data.update = Object.assign({}, value.update);
                    data.delete = Object.assign({}, value.delete);
                }  
                self.setFormatUpdate(data);
                if(value.add!==undefined)
                {
                    for(var i = 0;i<value.add.length;i++)
                    {
                        for(var param in value.add[i])
                        {
                            if(moduleDatabase.data[param]!==undefined)
                            {
                                moduleDatabase.data[param].setFormatAdd(value.add[i][param]);
                            }
                        }
                    }
                }
                if(value.update!==undefined)
                {
                    for(var i = 0;i<value.update.length;i++)
                    {
                        for(var param in value.update[i])
                        {
                            if(moduleDatabase.data[param]!==undefined)
                            {
                                moduleDatabase.data[param].setFormatUpdate(value.update[i][param]);
                            }
                        }
                    }
                }
            }
            resolve(data);
        }).catch(function(err){
            reject(err);
            console.error(err)
        })
    })
}

DataStructure.prototype.setFormatUpdate = function(data)
{
    var self = this;
    var temp = self.Libary["id"][data.id];
    for(var param in data)
    {
        if(self.Libary[param]!==undefined&&typeof self.Libary[param]!= "function"){
            if(temp[param] == data[param])
                continue;
            self.Libary[param].deleteFunction(temp,param);
            temp[param] = data[param];
            self.Libary[param].formatFunction(temp,param);
            if(self.Libary[param]===true)
            data.isCheckUpdate = true;
        }else
        temp[param] = data[param];
    }
}

DataStructure.prototype.delete = function(data){
    var self = this;
    return new Promise(function(resolve,reject){
        self.queryData(self.phpDeleter,data).then(function(value){
            if(data.id!==undefined)
            {
                var temp = self.Libary["id"][data.id];
                for(var param in self.Libary)
                {
                    if(typeof self.Libary[param]!= "function")
                    self.Libary[param].deleteFunction(temp,param);
                }
                self.data.splice(self.data.indexOf(temp),1);
                self.countRow--;
            }
            resolve();
        }).catch(function(err){
            reject(err);
            console.error(err)
        })
    })
}

export default moduleDatabase;

DataStructure.prototype.queryData = function (phpFile,data) {
    var self = this;
    var result = {};
    for(var param in  data){
        if(typeof data[param] == "function")
        continue;
        result[param] = data[param];
    }
    return new Promise(function(resolve,reject){
        FormClass.api_call({
            url: phpFile,
            params: [{name:"name",value:self.name},
                    {name:"data",value:EncodingClass.string.fromVariable(result)}],
            func: function(success, message) {
                if (success){
                    if (message.substr(0, 2) == "ok") {
                        var st = EncodingClass.string.toVariable(message.substr(2));
                        resolve(st);
                    }
                    else {
                        reject(message);
                    }
                }
            }
        });
    })
};

