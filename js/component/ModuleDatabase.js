import FormClass from './jsform';

var moduleDatabase = new ModuleDatabase();

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
}


DataStructure.prototype.load = function(data = [],isLoaded = false){
    var self = this;
    if(isLoaded == false&&self.data!==undefined)
        return Promise.resolve(self.data);

    return new Promise(function(resolve,reject){
        self.queryData(self.phpLoader,data).then(function(value){
            self.data = value;
            self.getLibary();
            resolve(value);
       })
       .catch(function(error){
           reject(error);
           console.error(error);
       })
    }) 
}

DataStructure.prototype.getLibary = function(param,isLoaded = false){
    if(param!==undefined){
        if(Array.isArray(param)===false)
        {
            
            param = [param];
        }else
            param = param;
    
        for(var j = 0;j<param.length;j++)
        {
            if(isLoaded = true||this.Libary[param] == undefined)
            {
                for(var i = 0;i<this.data.length;i++)
                {
                    this.setLibaryRow(this.data[i],param[j]);
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
            if(param = "id")
                isID = true;
            for(var i = 0;i<this.data.length;i++)
            {
                this.setLibaryRow(this.data[i],param);
            }
        }
        if(isID == false)
        {
            for(var i = 0;i<this.data.length;i++)
            {
                this.setLibaryRow(this.data[i],"id");
            }
        }
    }

    return this.Libary;
}

DataStructure.prototype.setLibaryRow = function(data,param){
    if(this.Libary[param]===undefined)
    this.Libary[param] = [];
    this.Libary[param][data[param]] = data;
    data.getList = function(name,value){
        var text = "";
        for(var i = 0;i<name.length;i++){
            if(data[name]===undefined)
            text+=name[i];
            else
            text+= data[name[i]];
        }

        var checkvalue = "";
        for(var i = 0;i<value.length;i++){
            if(data[value]===undefined)
            checkvalue+=value[i];
            else
            checkvalue+= data[value[i]];
        }
        return {text:text,value:checkvalue}
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
        self.queryData(self.phpDeleter,data).then(function(value){
            for(var param in self.Libary)
            {
                self.Libary[param][value[param]] = value;
            }
            resolve(value);
        }).catch(function(err){
            reject(err);
            console.error(err)
        })
    })
}

DataStructure.prototype.update = function(data){
    var self = this;
    return new Promise(function(resolve,reject){
        self.queryData(self.phpUpdater,data).then(function(value){
            var temp = self.Libary["id"][id];
            for(var param in data)
            {
                var old = data[param];
                temp[param] = data[param];
                if(self.Libary[param]!==undefined){
                    delete self.Libary[param][old];
                    self.Libary[param][temp[param]] = temp;
                } 
            }
            resolve(value);
        }).catch(function(err){
            reject(err);
            console.error(err)
        })
    })
}


DataStructure.prototype.delete = function(id){
    var self = this;
    return new Promise(function(resolve,reject){
        self.queryData(self.phpDeleter,id).then(function(id){
            for(var param in self.Libary)
            {
                var temp = self.Libary["id"][id];
                delete self.Libary[param][temp.param];
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
    return new Promise(function(resolve,reject){
        FormClass.api_call({
            url: phpFile,
            params: [{name:"name",value:self.name},
                    {name:"data",value:data}],
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

