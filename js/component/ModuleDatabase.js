export function ModuleDatabase() {
    console.log(Fcore)
}

export function loadData(phpLoader)
{
    var php = "https://lab.daithangminh.vn/home_co/pizo/php/php/load_help.php";
    if(phpLoader!==undefined)
    php = phpLoader;
    return new Promise(function(resolve,reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText.substr(2))
            resolve(EncodingClass.string.toVariable(this.responseText.substr(2)));
        }else
        {
            console.log(this.responseText,this.status)
        }
        };
        xhttp.open("GET", php, true);
        xhttp.send();
    })
}

export function updateData(phpUpdater,data)
{
    var php;
    if(phpUpdater!==undefined)
    php = phpUpdater;
    return new Promise(function(resolve,reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                resolve(EncodingClass.string.toVariable(this.responseText.substr(2)));
            }else
            {
                console.log(this.responseText,this.status)
            }
        };
        xhttp.open("POST", php, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var stringSend = "";
        var connect = "";
        for(var param in data)
        {
            stringSend+=connect+param+"="+encodeURIComponent(data[param]);
            connect = "&";
        }
        xhttp.send(stringSend);
    })
}
