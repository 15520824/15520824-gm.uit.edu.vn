var moduleDatabase = new ModuleDatabase();

function ModuleDatabase() {
    this.hostDatabase = "https://lab.daithangminh.vn/home_co/pizo/php/php/";
    this.loadAccountsPHP = this.hostDatabase+"load_accounts.php";
    this.loadActiveHomesPHP = this.hostDatabase+"load_activehomes.php";
    this.loadContactsPHP = this.hostDatabase+"load_contacts.php";
    this.loadDepartmentsPHP = this.hostDatabase+"load_departments.php";
    this.loadDistrictsPHP = this.hostDatabase+"load_districts.php";
    this.loadHelpPHP = this.hostDatabase+"load_help.php";
    this.loadNationsPHP = this.hostDatabase+"load_nations.php";
    this.loadPositionsPHP = this.hostDatabase+"load_positions.php";
    this.loadStatesPHP = this.hostDatabase+"load_states.php";
    this.loadStreetsPHP = this.hostDatabase+"load_streets.php";
    this.loadWardsPHP = this.hostDatabase+"load_wards.php";

    this.addAccountsPHP = this.hostDatabase+"add_account.php";
    this.addActiveHomesPHP = this.hostDatabase+"add_activehome.php";
    this.addContactsPHP = this.hostDatabase+"add_contact.php";
    this.addDepartmentsPHP = this.hostDatabase+"add_department.php";
    this.addDistrictsPHP = this.hostDatabase+"add_district.php";
    this.addHelpPHP = this.hostDatabase+"add_help.php";
    this.addNationsPHP = this.hostDatabase+"add_nation.php";
    this.addPositionsPHP = this.hostDatabase+"add_position.php";
    this.addStatesPHP = this.hostDatabase+"add_state.php";
    this.addStreetsPHP = this.hostDatabase+"add_street.php";
    this.addWardsPHP = this.hostDatabase+"add_ward.php";

    this.updateAccountsPHP = this.hostDatabase+"update_account.php";
    this.updateActiveHomesPHP = this.hostDatabase+"update_activehome.php";
    this.updateContactsPHP = this.hostDatabase+"update_contact.php";
    this.updateDepartmentsPHP = this.hostDatabase+"update_department.php";
    this.updateDistrictsPHP = this.hostDatabase+"update_district.php";
    this.updateHelpPHP = this.hostDatabase+"update_help.php";
    this.updateNationsPHP = this.hostDatabase+"update_nation.php";
    this.updatePositionsPHP = this.hostDatabase+"update_position.php";
    this.updateStatesPHP = this.hostDatabase+"update_state.php";
    this.updateStreetsPHP = this.hostDatabase+"update_street.php";
    this.updateWardsPHP = this.hostDatabase+"update_ward.php";

    this.deleteAccountsPHP = this.hostDatabase+"delete_account.php";
    this.deleteActiveHomesPHP = this.hostDatabase+"delete_activehome.php";
    this.deleteContactsPHP = this.hostDatabase+"delete_contact.php";
    this.deleteDepartmentsPHP = this.hostDatabase+"delete_department.php";
    this.deleteDistrictsPHP = this.hostDatabase+"delete_district.php";
    this.deleteHelpPHP = this.hostDatabase+"delete_help.php";
    this.deleteNationsPHP = this.hostDatabase+"delete_nation.php";
    this.deletePositionsPHP = this.hostDatabase+"delete_position.php";
    this.deleteStatesPHP = this.hostDatabase+"delete_state.php";
    this.deleteStreetsPHP = this.hostDatabase+"delete_street.php";
    this.deleteWardsPHP = this.hostDatabase+"delete_ward.php";
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
