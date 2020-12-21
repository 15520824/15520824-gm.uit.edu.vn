import BaseView from './component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import LoginForm from './page/LoginForm';
import "../css/App.css";
import R from './R';
import Fcore from './dom/Fcore';
import ListRealty from './page/ListRealty';
import ListWard from './page/ListWard';
import ListStreet from './page/ListStreet';
import ListState from './page/ListState';
import ListDistrict from './page/ListDistrict';
import PlanningInformation from './page/PlanningInformation';
import NoteInformation from './page/NoteInformation';
import ListHelp from './page/ListHelp';
import ListEditHelp from './page/ListEditHelp';
import ListPositions from './page/ListPositions';
import ListAccount from './page/ListAccount';
import NewAccount from './component/NewAccount';
import ListContact from './page/ListContact';
import ListEquipment from './page/ListEquipment';
import ListJuridical from './page/ListJuridical';
import MapRealty from './page/MapRealty';
import ListTypeActivehouse from './page/ListTypeActivehouse';
import { getCookie, eraseCookie, setCookie } from './component/FormatFunction';

import moduleDatabase from './component/ModuleDatabase';

var _ = Fcore._;
var $ = Fcore.$;

function App() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    moduleDatabase.getModule("activehouses", ["loadActiveHouses.php", "addActiveHouse.php", "updateActiveHouse.php", "deleteActivehouse.php"]);
    moduleDatabase.getModule("modification_requests", ["loadModificationRequests.php", "addModificationRequests.php", "updateModificationRequests.php", "deleteModificationRequests.php"])
    moduleDatabase.getModule("inactivehouses", ["loadActiveHouses.php", "addActiveHouse.php", "updateActiveHouse.php", "deleteActivehouse.php"]);
    moduleDatabase.getModule("contacts", ["load.php", "add.php", "update.php", "deleteContact.php"]);
    moduleDatabase.getModule("users", ["load.php", "addUser.php", "updateUser.php", "deleteUser.php"]);
    moduleDatabase.getModule("polygon", ["loadPolygon.php", "addPolygon.php", "updatePolygon.php", "deletePolygon.php"]);
    moduleDatabase.getModule("geometry", ["loadMap.php", "addMap.php", "updateMap.php", "deleteMap.php"]);
    moduleDatabase.getModule("geometry_created", ["loadCreatedMap.php"]);
    moduleDatabase.getModule("streets");
    moduleDatabase.getModule("helps");
    moduleDatabase.getModule("states");
    moduleDatabase.getModule("districts");
    moduleDatabase.getModule("wards");
    moduleDatabase.getModule("addresses");
    moduleDatabase.getModule("addresses_user");
    moduleDatabase.getModule("equipments");
    moduleDatabase.getModule("departments", ["load.php", "add.php", "update.php", "deleteDepartment.php"]);
    moduleDatabase.getModule("positions");
    moduleDatabase.getModule("juridicals");
    moduleDatabase.getModule("nations");
    moduleDatabase.getModule("type_activehouses");
    moduleDatabase.getModule("favourite", ["load.php", "addFavorite.php", "update.php", "deleteFavorite.php"]);
}

Object.defineProperties(App.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
App.prototype.constructor = App;

App.prototype.getView = function() {
    if (getCookie("token_pizo_phone") == undefined) {
        if (window.token == undefined) {
            var mLoginForm = new LoginForm();
            this.$view = mLoginForm.getView();
            mLoginForm.promiseLogin.then(function(token) {
                var parentNode = this.$view.parentNode;
                var pastView = this.$view;
                parentNode.replaceChild(this.getView(), pastView);
            }.bind(this))
            return this.$view;
        }
    } else {
        if (window.token == undefined) {
            moduleDatabase.queryData("getToken.php", { token: getCookie("token_pizo_phone"), userid: getCookie("userid_pizo_phone") }, "safe_login").then(function(value) {
                if (value == false) {
                    eraseCookie("token_pizo_phone");
                    eraseCookie("userid_pizo_phone");
                    var parentNode = this.$view.parentNode;
                    var pastView = this.$view;
                    parentNode.replaceChild(this.getView(), pastView);
                    moduleDatabase.checkPermission = undefined;
                } else {
                    setCookie("token_pizo_phone", getCookie("token_pizo_phone"), 3);
                    setCookie("userid_pizo_phone", getCookie("userid_pizo_phone"), 3);
                    window.token = getCookie("token_pizo_phone");
                    window.userid = getCookie("userid_pizo_phone");
                    moduleDatabase.getModule("users").setFormatLoad({ WHERE: [{ userid: getCookie("userid_pizo_phone") }] }, value);
                    this.imageAvatar.src = "https://lab.daithangminh.vn/home_co/pizo/assets/avatar/" + moduleDatabase.getModule("users").getLibary("id")[window.userid].avatar;
                    this.nameAvatar.innerHTML = moduleDatabase.getModule("users").getLibary("id")[window.userid].name.split(" ").pop();
                    this.getPermisionOpenPage();
                }
            }.bind(this))
        } else {
            this.getPermisionOpenPage();
            this.enableAvatar = true;
        }
    }
    var self = this;
    this.imageAvatar = _({
        tag: "img",
        class: ["_2qgu", "_7ql", "_1m6h", "img"],
        props: {
            src: "./assets/avatar/avatar-default.png"
        }
    });
    this.nameAvatar = _({
        tag: "span",
        class: "_1vp5",
        props: {
            innerHTML: ""
        }
    });
    var avatarIcon = _({
        tag: "div",
        class: ["_1k67", "_cy7"],
        child: [{
            tag: "span",
            class: "_1qv9",
            child: [
                this.imageAvatar,
                this.nameAvatar
            ]
        }]
    })
    var docTypeMemuProps = {
        items: [{
                text: 'Hồ sơ cá nhân',
                icon: {
                    tag: "i",
                    class: "material-icons",
                    props: {
                        innerHTML: "person"
                    }
                },
                value: "information"
            },
            {
                text: 'Đăng xuất',
                icon: {
                    tag: "i",
                    class: "material-icons",
                    props: {
                        innerHTML: "arrow_forward"
                    }
                },
                value: "logout"
            },
        ]
    };

    absol.QuickMenu.showWhenClick(avatarIcon, docTypeMemuProps, [2], function(menuItem) {
        switch (menuItem.value) {
            case "information":
                if (window.userid !== undefined)
                    this.prevEdit({ original: moduleDatabase.getModule("users").getLibary("id")[window.userid] });
                break;
            case "logout":
                moduleDatabase.queryData("deleteToken.php", { token: getCookie("token_pizo_phone"), userid: getCookie("userid_pizo_phone") }, "safe_login").then(function(value) {})
                eraseCookie("token_pizo_phone");
                eraseCookie("userid_pizo_phone");
                window.token = undefined;
                window.userid = undefined;
                var parentNode = this.$view.parentNode;
                var pastView = this.$view;
                parentNode.replaceChild(this.getView(), pastView);
                moduleDatabase.checkPermission = undefined;
                break;
        }
    }.bind(this));

    this.body = _({
        tag: "frameview",
        style: {
            width: '100%',
            height: '100%'
        }
    })
    this.firstElement = [];
    this.$view = _({
        tag: "div",
        class: "pizo-app",
        child: [{
                tag: "div",
                class: "pizo-header",
                child: [{
                        tag: "div",
                        class: "outer-wrapper",
                        child: [{
                                tag: "div",
                                class: "pizo-header-logo",
                                child: [{
                                        tag: "img",
                                        class: "pizo-header-logo-icon",
                                        props: {
                                            src: "assets/images/logo.png"
                                        }
                                    },
                                    {
                                        tag: "img",
                                        class: "pizo-header-logo-text",
                                        props: {
                                            src: "assets/images/logo-text.png"
                                        }
                                    }
                                ]
                            },
                            {
                                tag: "div",
                                class: "portal-section",
                                child: [{
                                    tag: "div",
                                    class: "not-loggedin",
                                    child: [
                                        avatarIcon
                                    ]
                                }]
                            },
                            {
                                tag: "hmenu",
                                class: "pizo-header-menu",
                                props: {
                                    items: this.firstElement
                                },
                                on: {
                                    press: function(event) {
                                        var item = event.menuItem;
                                        if (typeof item.pageIndex == 'number') {
                                            self.prevOpenPage(item.pageIndex);
                                            document.body.click();
                                        }
                                    }
                                },
                            }
                        ]
                    },

                ]
            },
            {
                tag: "div",
                class: "pizo-body",
                child: [{
                        tag: "div",
                        class: "pizo-body-title",
                        child: [{
                            tag: "span",
                            class: "pizo-body-title-right",
                            child: [{
                                tag: "div",
                                class: "pizo-body-title-right-item",
                                on: {
                                    load: function(event) {

                                        self.pageSelect = this;
                                    }
                                },
                                props: {
                                    innerHTML: ""
                                }
                            }]
                        }]
                    },
                    {
                        tag: 'div',
                        class: 'pizo-body-dashboard',
                        child: [
                            this.body
                        ]
                    }
                ]
            }
        ]
    });
    this.hMenu = $("div.pizo-header-menu", this.$view);
    this.refresh();
    if (this.enableAvatar) {
        this.imageAvatar.src = "https://lab.daithangminh.vn/home_co/pizo/assets/avatar/" + moduleDatabase.getModule("users").getLibary("id")[window.userid].avatar;
        this.nameAvatar.innerHTML = moduleDatabase.getModule("users").getLibary("id")[window.userid].name.split(" ").pop();
        this.enableAvatar = undefined;
    }
    var arr = [];
    arr.push(moduleDatabase.getModule("positions").load());
    arr.push(moduleDatabase.getModule("wards").load());
    arr.push(moduleDatabase.getModule("districts").load());
    arr.push(moduleDatabase.getModule("states").load());
    this.promiseAll = Promise.all(arr);
    this.promiseAll.then(function() {
        this.listParamPosition = moduleDatabase.getModule("positions").getList("name", "id");
    }.bind(this));
    return this.$view;
}

App.prototype.refresh = function() {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

App.prototype.getPermisionOpenPage = function() {
    if (moduleDatabase.checkPermission == undefined) {
        moduleDatabase.checkPermission = [];
        moduleDatabase.checkPermission[0] = [];
        var arr = [];
        this.promisePermission = moduleDatabase.queryData("loadPermision.php", { userid: window.userid }, "privileges");
        arr.push(this.promisePermission);
        arr.push(moduleDatabase.getModule("favourite").load({ WHERE: [{ userid: window.userid }] }));
        Promise.all(arr).then(function(resultAll){
            var result = resultAll[0];
            for (var i = 0; i < result.length; i++) {
                var permissionTemp = result[i].permission
                if (permissionTemp < 56 && permissionTemp > 0) {
                    moduleDatabase.checkPermission[0].push(permissionTemp);
                } else {
                    var indexTemp = "{";
                    if (result[i]["stateid"] !== 0) {
                        indexTemp += '"stateid":"' + result[i]["stateid"] + '"';
                    }
                    if (result[i]["districtid"] !== 0) {
                        indexTemp += ',"districtid":"' + result[i]["districtid"] + '"';
                    }
                    if (result[i]["wardid"] !== 0) {
                        indexTemp += ',"wardid":"' + result[i]["districtid"] + '"';
                    }
                    if (result[i]["streetid"] !== 0) {
                        indexTemp += ',"streetid":"' + result[i]["streetid"] + '"';
                    }
                    if (indexTemp == "{")
                        indexTemp = 0;
                    else
                        indexTemp += "}";
                    if (moduleDatabase.checkPermission[indexTemp] == undefined)
                        moduleDatabase.checkPermission[indexTemp] = [];
                    moduleDatabase.checkPermission[indexTemp].push(permissionTemp);
                }
            }
            if (this.firstElement == undefined)
                this.firstElement = [];
            var isRealty = false;
            var checkStringPermission = JSON.stringify(moduleDatabase.checkPermission);
            if (checkStringPermission.indexOf(57) == -1 &&
                checkStringPermission.indexOf(58) == -1 &&
                checkStringPermission.indexOf(59) == -1 &&
                checkStringPermission.indexOf(60) == -1 &&
                checkStringPermission.indexOf(61) == -1 &&
                checkStringPermission.indexOf(62) == -1 &&
                checkStringPermission.indexOf(63) == -1 &&
                checkStringPermission.indexOf(64) == -1 &&
                checkStringPermission.indexOf(65) == -1 &&
                checkStringPermission.indexOf(69) == -1) {
                moduleDatabase.isStaff = true;
            }
            for (var param in moduleDatabase.checkPermission) {
                if (param == 0) {
                    if (moduleDatabase.checkPermission[0].indexOf(13) != -1 ||
                        moduleDatabase.checkPermission[0].indexOf(17) != -1 ||
                        moduleDatabase.checkPermission[0].indexOf(21) != -1 ||
                        moduleDatabase.checkPermission[0].indexOf(25) != -1 ||
                        moduleDatabase.checkPermission[0].indexOf(29) != -1) {
                        var menuZone = [];
                        if (moduleDatabase.checkPermission[0].indexOf(13) != -1)
                            menuZone.push({
                                text: "Tỉnh/TP",
                                pageIndex: 21
                            })
                        if (moduleDatabase.checkPermission[0].indexOf(17) != -1)
                            menuZone.push({
                                text: "Quận/Huyện",
                                pageIndex: 22
                            })
                        if (moduleDatabase.checkPermission[0].indexOf(21) != -1)
                            menuZone.push({
                                text: "Phường/Xã",
                                pageIndex: 23
                            })
                        if (moduleDatabase.checkPermission[0].indexOf(25) != -1)
                            menuZone.push({
                                text: "Tên đường",
                                pageIndex: 24
                            })
                        if (moduleDatabase.checkPermission[0].indexOf(29) != -1) {
                            menuZone.push({
                                text: "Thông tin quy hoạch",
                                pageIndex: 26
                            })
                            menuZone.push({
                                text: "Thông tin quy hoạch chú thích",
                                pageIndex: 27
                            })
                        }
                        this.firstElement.push({
                            text: "Khu vực",
                            pageIndex: 2,
                            items: menuZone
                        })
                    }

                    if (moduleDatabase.checkPermission[0].indexOf(9) != -1 ||
                        moduleDatabase.checkPermission[0].indexOf(33) != -1 ||
                        moduleDatabase.checkPermission[0].indexOf(37) != -1 ||
                        moduleDatabase.checkPermission[0].indexOf(41) != -1) {
                        var menuZone = [];
                        if (moduleDatabase.checkPermission[0].indexOf(33) != -1)
                            menuZone.push({
                                text: "Tiện nghi trong nhà",
                                pageIndex: 31
                            })
                        if (moduleDatabase.checkPermission[0].indexOf(37) != -1)
                            menuZone.push({
                                text: "Pháp lý",
                                pageIndex: 32
                            })
                        if (moduleDatabase.checkPermission[0].indexOf(9) != -1)
                            menuZone.push({
                                text: "Thông tin liên hệ",
                                pageIndex: 33
                            })
                        if (moduleDatabase.checkPermission[0].indexOf(41) != -1)
                            menuZone.push({
                                text: "Loại bất động sản",
                                pageIndex: 34
                            })

                        this.firstElement.push({
                            text: "Thông tin",
                            pageIndex: 3,
                            items: menuZone
                        })
                    }

                    if (moduleDatabase.checkPermission[0].indexOf(49) != -1) {
                        var menuZone = [];
                        this.firstElement.push({
                            text: "Thông báo",
                            pageIndex: 4,
                            items: menuZone
                        })
                    }

                    if (moduleDatabase.checkPermission[0].indexOf(5) != -1) {
                        var menuZone = [];
                        this.firstElement.push({
                            text: "Sơ đồ tổ chức",
                            pageIndex: 5,
                            items: menuZone
                        })
                    }

                    if (moduleDatabase.checkPermission[0].indexOf(1) != -1) {
                        var menuZone = [];
                        this.firstElement.push({
                            text: "Tài khoản",
                            pageIndex: 6,
                            items: menuZone
                        })
                    }

                    if (moduleDatabase.checkPermission[0].indexOf(53) != -1 ||
                        moduleDatabase.checkPermission[0].indexOf(54) != -1 ||
                        moduleDatabase.checkPermission[0].indexOf(55) != -1) {
                        var menuZone = [];
                        if (moduleDatabase.checkPermission[0].indexOf(53) != -1)
                            menuZone.push({
                                text: "Tổng quan",
                                pageIndex: 71
                            })
                        if (moduleDatabase.checkPermission[0].indexOf(54) != -1)
                            menuZone.push({
                                text: "Cuộc gọi",
                                pageIndex: 72
                            })
                        if (moduleDatabase.checkPermission[0].indexOf(55) != -1)
                            menuZone.push({
                                text: "Upload hình",
                                pageIndex: 73
                            })

                        this.firstElement.push({
                            text: "Thống kê",
                            pageIndex: 7,
                            items: menuZone
                        })
                    }


                    if (moduleDatabase.checkPermission[0].indexOf(51) != -1 ||
                        moduleDatabase.checkPermission[0].indexOf(52) != -1) {
                        var menuZone = [];
                        this.firstElement.push({
                            text: "Nhập xuất dữ liệu",
                            pageIndex: 9,
                            items: menuZone
                        })
                    }

                    // if (moduleDatabase.checkPermission[0].indexOf(45) != -1) {
                    //     var menuZone = [];
                    //     if (moduleDatabase.checkPermission[0].indexOf(45) != -1)
                    //         menuZone.push({
                    //             text: "Sửa trợ giúp",
                    //             pageIndex: 101
                    //         })
                    //     this.firstElement.push({
                    //         text: "Trợ giúp",
                    //         pageIndex: 10,
                    //         items: menuZone
                    //     })
                    // }
                }
                isRealty = true;
            }
            if (isRealty === true)
                this.firstElement.unshift({
                    text: "Dự án",
                    pageIndex: 1,
                    items: [{
                            text: "Tất cả",
                            pageIndex: 11
                        },
                        {
                            text: "Dự án đã quan tâm",
                            pageIndex: 12
                        },
                        // {
                        //     text:"Cần kiểm duyệt",
                        //     pageIndex:13
                        // },
                        // {
                        //     text: "Cần gọi lại",
                        //     pageIndex: 14
                        // },
                        // {
                        //     text: "Cần gộp",
                        //     pageIndex: 15
                        // },
                        {
                            text: "Yêu cầu chỉnh sửa",
                            pageIndex: 17
                        },
                        {
                            text: "Bản đồ",
                            pageIndex: 18
                        }
                    ]
                });
            this.hMenu.items = this.firstElement;
        }.bind(this))
    }
}

App.prototype.prevOpenPage = function(index) {
    this.promisePermission.then(function() {
        this.openPage(index);
    }.bind(this));
}

App.prototype.openPage = function(index) {
    var finalPage;
    switch (index) {
        case 4:
            // xmlModalDragManyFiles.createModal(document.body,function(value){
            //     console.log(value);
            // })
            break;
        case 5:
            var mListPositions = new ListPositions();
            mListPositions.attach(this);
            var frameview = mListPositions.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListPositions;
            break;
        case 6:
            var mListAccount = new ListAccount();
            mListAccount.attach(this);
            var frameview = mListAccount.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListAccount;
            break;
        case 11:
            var mListRealty = new ListRealty();
            mListRealty.attach(this);
            var frameview = mListRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListRealty;
            break;
        case 12:
            var mListRealty = new ListRealty();
            mListRealty.attach(this);
            mListRealty.isFavourite = true;
            if(moduleDatabase.stackUpdateFavourite == undefined)
            moduleDatabase.stackUpdateFavourite = [];
            moduleDatabase.stackUpdateFavourite.push(mListRealty);
            var frameview = mListRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListRealty;
            break;
        case 13:
            var mListRealty = new ListRealty();
            mListRealty.attach(this);
            mListRealty.setCensorship();
            var frameview = mListRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListRealty;
            break;
        case 14:
            var mListRealty = new ListRealty();
            mListRealty.attach(this);
            var frameview = mListRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListRealty;
            break;
        case 15:
            var mListRealty = new ListRealty();
            mListRealty.attach(this);
            var frameview = ListRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListRealty;
            break;
        case 16:
            var mListRealty = new ListRealty();
            mListRealty.attach(this);
            var frameview = mListRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListRealty;
            break;
        case 17:
            var mListRealty = new ListRealty();
            mListRealty.attach(this);
            var frameview = mListRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListRealty;
            break;
        case 18:
            var mMapRealty = new MapRealty();
            mMapRealty.attach(this);
            var frameview = mMapRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mMapRealty;
            break;
        case 21:
            var mListState = new ListState();
            mListState.attach(this);
            var frameview = mListState.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListState;
            break;
        case 22:
            var mListDistrict = new ListDistrict();
            mListDistrict.attach(this);
            var frameview = mListDistrict.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListDistrict;
            break;
        case 23:
            var mListWard = new ListWard();
            mListWard.attach(this);
            var frameview = mListWard.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListWard;
            break;
        case 24:
            var mListStreet = new ListStreet();
            mListStreet.attach(this);
            var frameview = mListStreet.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListStreet;
            break;
        case 26:
            var mPlanningInformation = new PlanningInformation();
            mPlanningInformation.attach(this);
            var frameview = mPlanningInformation.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mPlanningInformation;
            break;
        case 27:
            var mNoteInformation = new NoteInformation();
            mNoteInformation.attach(this);
            var frameview = mNoteInformation.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mNoteInformation;
            break;
        case 31:
            var mListEquipment = new ListEquipment();
            mListEquipment.attach(this);
            var frameview = mListEquipment.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListEquipment;
            break;
        case 32:
            var mListJuridical = new ListJuridical();
            mListJuridical.attach(this);
            var frameview = mListJuridical.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListJuridical;
            break;
        case 33:
            var mListContact = new ListContact();
            mListContact.attach(this);
            var frameview = mListContact.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListContact;
            break;
        case 34:
            var mListTypeActivehouse = new ListTypeActivehouse();
            mListTypeActivehouse.attach(this);
            var frameview = mListTypeActivehouse.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListTypeActivehouse;
            break;
        case 10:
            var mListHelp = new ListHelp();
            mListHelp.attach(this);
            var frameview = mListHelp.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            break;
        case 101:
            var mListEditHelp = new ListEditHelp();
            mListEditHelp.attach(this);
            var frameview = mListEditHelp.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            finalPage = mListEditHelp;
            break;

    }
    return finalPage;

}

App.prototype.prevEdit = function(data, parent, index) {
    this.promiseAll.then(function() {
        this.edit(data, parent, index);
    }.bind(this));
}

App.prototype.edit = function(data, parent, index) {
    var self = this;
    var mNewAccount = new NewAccount(data);
    mNewAccount.attach(self);
    mNewAccount.setOnlyInformation();
    var frameview = mNewAccount.getView(self.listParamPosition);
    self.body.addChild(frameview);
    self.body.activeFrame(frameview);
    self.editDB(mNewAccount, data, parent, index);
}

App.prototype.editDB = function(mNewAccount, data, parent, index) {
    var self = this;
    mNewAccount.promiseEditDB.then(function(value) {
        moduleDatabase.getModule("users").update(value).then(function(result) {
            self.editView(value, data, parent, index);
        })
        mNewAccount.promiseEditDB = undefined;
        setTimeout(function() {
            if (mNewAccount.promiseEditDB !== undefined) {
                self.editDB(mNewAccount, data, parent, index);
            }
        }, 10);
    })
}

App.prototype.editView = function(value, data, parent, index) {}

App.prototype.setData = function(data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

App.prototype.flushDataToView = function() {
    if (this.dataFlushed) return;
    this.dataFlushed = true;
    //TODO: remove older view
    if (!this.data) return;
    this.$content.clearChild();
    if (this.data && this.$view) {
        this.rootComponent = this.build(this.data);
        this.$content.addChild(this.rootComponent.view);
        this.rootComponent.onAttach();
        this.$widthIp.value = this.rootComponent.getStyle('width', 'px');
        this.$heightIp.value = this.rootComponent.getStyle('height', 'px');
    }
};

App.prototype.start = function() {

}

export default App;