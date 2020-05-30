var moduleDatabase = new ModuleDatabase();

function ModuleDatabase() {
    this.hostDatabase = "https://lab.daithangminh.vn/home_co/pizo/php/php/";

    this.data = [];
    this.data["accounts"] = new DataStructure(  this.hostDatabase+"load_accounts.php",
                                                this.hostDatabase+"add_account.php",
                                                this.hostDatabase+"update_account.php",
                                                this.hostDatabase+"delete_account.php");
    this.data["activehouses"] = new DataStructure(  this.hostDatabase+"load_activehomes.php",
                                                    this.hostDatabase+"add_activehome.php",
                                                    this.hostDatabase+"update_activehome.php",
                                                    this.hostDatabase+"delete_activehome.php");
    this.data["contacts"]= new DataStructure(   this.hostDatabase+"load_contacts.php",
                                                this.hostDatabase+"add_contact.php",
                                                this.hostDatabase+"update_contact.php",
                                                this.hostDatabase+"delete_contact.php");
    this.data["departments"] = new DataStructure(   this.hostDatabase+"load_departments.php",
                                                    this.hostDatabase+"add_department.php",
                                                    this.hostDatabase+"update_department.php",
                                                    this.hostDatabase+"delete_department.php");
    this.data["districts"] = new DataStructure( this.hostDatabase+"load_districts.php",
                                                this.hostDatabase+"add_district.php",
                                                this.hostDatabase+"update_district.php",
                                                this.hostDatabase+"delete_district.php");
    this.data["helps"] = new DataStructure( this.hostDatabase+"load_accounts.php",
                                            this.hostDatabase+"add_account.php",
                                            this.hostDatabase+"update_account.php",
                                            this.hostDatabase+"delete_account.php");
    this.data["nations"] = new DataStructure(   this.hostDatabase+"load_accounts.php",
                                                this.hostDatabase+"add_account.php",
                                                this.hostDatabase+"update_account.php",
                                                this.hostDatabase+"delete_account.php");
    this.data["positions"] = new DataStructure( this.hostDatabase+"load_accounts.php",
                                                this.hostDatabase+"add_account.php",
                                                this.hostDatabase+"update_account.php",
                                                this.hostDatabase+"delete_account.php");
    this.data["states"]  = new DataStructure(   this.hostDatabase+"load_accounts.php",
                                                this.hostDatabase+"add_account.php",
                                                this.hostDatabase+"update_account.php",
                                                this.hostDatabase+"delete_account.php");
    this.data["streets"] = new DataStructure(   this.hostDatabase+"load_accounts.php",
                                                this.hostDatabase+"add_account.php",
                                                this.hostDatabase+"update_account.php",
                                                this.hostDatabase+"delete_account.php");
    this.data["wards"] = new DataStructure( this.hostDatabase+"load_accounts.php",
                                            this.hostDatabase+"add_account.php",
                                            this.hostDatabase+"update_account.php",
                                            this.hostDatabase+"delete_account.php");
}



function DataStructure(phpLoader,phpAdder,phpUpdater,phpDeleter){
   this.phpLoader = phpLoader;
   this.phpAdder = phpAdder;
   this.phpUpdater = phpUpdater;
   this.phpDeleter = phpDeleter;
   Object.assign(this,ModuleDatabase.prototype);
   this.Libary = [];
}

DataStructure.prototype.load = function(data){
    self = this;
    this.loadData(self.phpLoader,data).then(function(value){
        self.data = value;
   }) 
}

DataStructure.prototype.checkLibary = function(param){
    if(Array.isArray(param)===false)
    {
        param = [param];
    }
    for(var i = 0;i<this.data.length;i++)
    {
        for(var j = 0;j<param.length;j++)
        {
            if(this.Libary[param[j]]===undefined)
            this.Libary[param[j]] = [];
            this.Libary[param[j]][this.data[param[j]]] = this.data[i];
        }
    }
    if(param.length == 1)
    return this.Libary[param[0]];
    return this.Libary;
}

DataStructure.prototype.delete = function(id){
    var self = this;
    return new Promise(function(resolve,reject){
        this.updateData(self.phpDeleter,data).then(function(id){
            for(var param in self.Libary.length)
            {
                
            }
            resolve();
        }).catch(function(err){
            console.error(err)
        })
    })
}

DataStructure.prototype.add = function(data){
    var self = this;
    return new Promise(function(resolve,reject){
        this.updateData(self.phpDeleter,data).then(function(value){
            resolve(value);
        })
    }).catch(function(err){
        console.error(err)
    })
}

DataStructure.prototype.update = function(data){
    var self = this;
    return new Promise(function(resolve,reject){
        this.updateData(self.phpUpdater,data).then(function(value){
            resolve(value);
        })
    }).catch(function(err){
        console.error(err)
    })
}

export default moduleDatabase;

ModuleDatabase.prototype.loadData = function (phpLoader) {
    var php;
    if (phpLoader !== undefined)
        php = phpLoader;
    else
        return Promise.reject();
    return new Promise(function (resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(EncodingClass.string.toVariable(this.responseText.substr(2)));
            } else {
                console.log(this.responseText);
            }
        };
        xhttp.open("GET", php, true);
        xhttp.send();
    });
};

ModuleDatabase.prototype.updateData = function (phpUpdater, data) {
    var php;
    if (phpUpdater !== undefined)
        php = phpUpdater;
    else
        return Promise.reject();
    return new Promise(function (resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(EncodingClass.string.toVariable(this.responseText.substr(2)));
            } else {
                console.log(this.responseText);
            }
        };
        xhttp.open("POST", php, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var stringSend = "";
        var connect = "";
        for (var param in data) {
            stringSend += connect + param + "=" + encodeURIComponent(data[param]);
            connect = "&";
        }
        xhttp.send(stringSend);
    });
};
