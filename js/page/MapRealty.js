import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/MapRealty.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { formatNumber, reFormatNumber, isQueryMap, loadingWheel, formatDate } from '../component/FormatFunction'

import { MapView } from "../component/MapView";
import moduleDatabase from '../component/ModuleDatabase';
import { descViewImagePreview } from '../component/ModuleImage';
import NewRealty from '../component/NewRealty';
import { unit_Long, unit_Zone, tableView } from '../component/ModuleView';
import BrowserDetector from 'absol/src/Detector/BrowserDetector';

var _ = Fcore._;
var $ = Fcore.$;

function MapRealty() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.hash = [];
}

MapRealty.prototype.setContainer = function(parent) {
    this.parent = parent;
}

Object.defineProperties(MapRealty.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
MapRealty.prototype.constructor = MapRealty;

MapRealty.prototype.getView = function() {
    if (this.$view) return this.$view;
    var self = this;
    var allinput = _({
        tag: "input",
        class: "pizo-list-realty-page-allinput-input",
        props: {
            placeholder: "Tìm theo địa chỉ"
        }
    });
    if (BrowserDetector.isMobile) {
        allinput.placeholder = "Tìm theo địa chỉ"
    }

    var mapView = new MapView();
    mapView.setLabelUnder(false);
    mapView.activePlanningMap();
    mapView.setCurrentLocation();
    mapView.setMoveMarkerWithCurrent(false);
    mapView.geolocateMap();
    this.$view = _({
        tag: 'singlepage',
        class: "pizo-list-realty",
        child: [{
            class: 'absol-single-page-header',
            style: {
                paddingRight: 0
            },
            child: [{
                    tag: "span",
                    class: "pizo-body-title-left",
                    props: {
                        innerHTML: "Nhà đất"
                    }
                },
                {
                    tag: "div",
                    class: "pizo-list-realty-button",
                    child: [{
                        tag: "button",
                        class: ["pizo-list-realty-button-quit", "pizo-list-realty-button-element"],
                        on: {
                            click: function(evt) {
                                self.$view.selfRemove();
                                var arr = self.parent.body.getAllChild();
                                self.parent.body.activeFrame(arr[arr.length - 1]);
                            }
                        },
                        child: [
                            '<span>' + "Đóng" + '</span>'
                        ]
                    }]
                },
                {
                    tag: "div",
                    class: "pizo-list-realty-page-allinput",
                    style: {
                        width: "calc(100% - 190px)"
                    },
                    child: [{
                        tag: "div",
                        class: "pizo-list-realty-page-allinput-container",
                        style: {
                            width: "100%"
                        },
                        child: [
                            allinput,
                            {
                                tag: "button",
                                class: "pizo-list-realty-page-allinput-search",
                                child: [{
                                    tag: 'i',
                                    class: 'material-icons',
                                    props: {
                                        innerHTML: 'search'
                                    },
                                }, ]
                            },
                        ]
                    }, ]
                }
            ]
        }, ]
    });

    this.allinput = allinput;
    var searchBox = new google.maps.places.SearchBox(allinput, {
        // terms:['street_number','route','locality','administrative_area_level_1','administrative_area_level_2','administrative_area_level_3'],
        types: ['geocode'],
        componentRestrictions: { country: 'vn' }
    });

    this.searchBox = searchBox;

    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        // For each place, get the icon, place name, and location.
        self.mapView.map.setZoom(20);
        var bounds = new google.maps.LatLngBounds();
        var place = null;
        for (var i = 0; place = places[i]; i++) {
            bounds.extend(place.geometry.location);
        }
        self.mapView.map.setCenter(bounds.getCenter());
    });
    this.mapView = mapView;
    var arr = [];
    arr.push(moduleDatabase.getModule("wards").load());
    arr.push(moduleDatabase.getModule("type_activehouses").load());
    arr.push(moduleDatabase.getModule("districts").load());
    arr.push(moduleDatabase.getModule("states").load());
    arr.push(moduleDatabase.getModule("equipments").load());
    arr.push(moduleDatabase.getModule("juridicals").load());
    moduleDatabase.getModule("users").load().then(function(value) {
        self.checkUser = moduleDatabase.getModule("users").getLibary("phone");
        self.checkUserID = moduleDatabase.getModule("users").getLibary("id");
    })

    // moduleDatabase.getModule("contacts").load().then(function(value) {
    //     self.checkContact = moduleDatabase.getModule("contacts").getLibary("phone");
    //     self.checkContactID = moduleDatabase.getModule("contacts").getLibary("id");
    // });
    var startDay, endDay;
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 1);
    startDay = _({
        tag: 'calendar-input',
        data: {
            anchor: 'top',
            value: oneYearFromNow,
            maxDateLimit: new Date()
        },
        on: {
            changed: function(date) {
                endDay.minDateLimit = date;
            }
        }
    })

    endDay = _({
        tag: 'calendar-input',
        data: {
            anchor: 'top',
            value: new Date(),
            minDateLimit: new Date()
        },
        on: {
            changed: function(date) {

                startDay.maxDateLimit = date;
            }
        }
    })
    Promise.all(arr).then(function(values) {
        this.checkState = moduleDatabase.getModule("states").getLibary("id");
        this.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");
        this.checkWard = moduleDatabase.getModule("wards").getLibary("id");
        this.checkequipment = moduleDatabase.getModule("equipments").getLibary("id");
        this.checkJuridical = moduleDatabase.getModule("juridicals").getLibary("id");
        this.checkTypeHouse = moduleDatabase.getModule("type_activehouses").getLibary("id");
        this.searchControl = this.searchControlContent();

        this.$view.addChild(_({
            tag: "div",
            class: ["pizo-list-plan-main"],
            style: {
                flexDirection: "column"
            },
            child: [
                this.searchControl,
                {
                    tag: "div",
                    class: ["pizo-list-realty-main-result-control"],
                    child: [{
                        tag: "div",
                        class: "pizo-list-realty-main-result-control-map-view",
                        child: [
                            mapView,
                            self.modalRealty(),
                        ]
                    }]
                }
            ]
        }));
    }.bind(this))

    moduleDatabase.getModule("users").load().then(function(value) {
        self.formatDataRowAccount(value);
    })

    // moduleDatabase.getModule("contacts").load().then(function(value) {
    //     self.formatDataRowContact(value);
    // })

    return this.$view;
}

MapRealty.prototype.formatDataRowAccount = function(data) {
    this.listAccoutData = data;
}

MapRealty.prototype.formatDataRowContact = function(data) {
    this.listContactData = data;
}


MapRealty.prototype.modalRealty = function() {
    var self = this;

    var container = new tableView([{}, {}], [], true, true, 1, 25);
    container.classList = "photo-cards photo-cards_wow photo-cards_short";
    container.headerTable.style.display = "none";
    // container.setAttribute("class", []);
    var temp = _({
        tag: "div",
        class: ["search-page-list-container", "double-column-only", "short-list-cards"],
        child: [{
                tag: "div",
                class: "result-list-container",
                child: [{
                        tag: "div",
                        class: "search-page-list-header",
                        child: [{
                                tag: "h1",
                                class: "search-title",
                                props: {
                                    innerHTML: "BẤT ĐỘNG SẢN RAO BÁN"
                                }
                            },
                            {
                                tag: "div",
                                class: "search-subtitle",
                                child: [{
                                        tag: "span",
                                        class: "result-count"
                                    },
                                    {
                                        tag: "div",
                                        class: ["sort-options", "visible"],
                                        child: [{
                                                tag: "strong",
                                                style: {
                                                    lineHeight: "30px"
                                                },
                                                props: {
                                                    innerHTML: "Sắp xếp theo:"
                                                }
                                            },
                                            {
                                                tag: "selectmenu",
                                                style: {
                                                    marginLeft: "10px"
                                                },
                                                props: {
                                                    items: [
                                                        { text: "Mới nhất", value: 0 },
                                                        { text: "Giá (Thấp tới cao)", value: 1 },
                                                        { text: "Giá (Cao tới thấp)", value: 2 },
                                                        { text: "Diện tích", value: 3 }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    container
                ]
            },
            {
                tag: "div",
                class: ["zsg-subfooter", "region-info-footer"]
            }
        ]
    })
    container.check = [];
    this.count = $("span.result-count", temp);
    this.updateResult = function() {
        var value = this.mapView.markerCluster.getMarkers();
        // var cellLat, cellLng, arrTemp;
        // var k = 0;
        // for (var i = 0; i < this.mapView.currentHouse.length; i++) {
        //     cellLat = this.mapView.currentHouse[i][0];
        //     cellLng = this.mapView.currentHouse[i][1];
        //     arrTemp = this.mapView.checkHouse[cellLat][cellLng];
        //     for (var j = 0; j < arrTemp.length; j++) {
        //         if (arrTemp[j].getMap() != null) {
        //             value.push(arrTemp[j]);
        //         }
        //         k++;
        //     }
        // }
        // container.clearChild();


        var arr = [];
        var connect = "";
        for (var i = 0; i < value.length; i++) {
            if (connect !== "")
                arr.push(connect);
            arr.push({ id: value[i].data.streetid });
            connect = "||";
            if (value[i].data.streetid) {
                arr.push(connect);
                arr.push({ id: value[i].data.streetid_old });
            }
        }
        var row = [];
        if (arr.length > 0)
            moduleDatabase.getModule("streets").load({ WHERE: arr }).then(function(valueStr) {
                self.checkStreet = moduleDatabase.getModule("streets").getLibary("id");
                var valueTable = [];
                for (var i = 0; i < value.length; i++) {
                    if (container.check[value[i].data.id] == undefined) {
                        var x = this.itemMap(value[i]);
                        container.check[value[i].data.id] = x;
                    } else {
                        var x = container.check[value[i].data.id];
                    }
                    x.setPrice(value[i].get('labelContent').childNodes[1].innerHTML.toString());

                    // container.appendChild(x);
                    row.push({ element: x });
                    if (row.length == 2) {
                        valueTable.push(row);
                        row = [];
                    }
                }
                container.updateTable(undefined, valueTable);
                this.count.innerHTML = value.length + " kết quả";

            }.bind(this))
        else {
            container.updateTable(undefined, []);
            this.count.innerHTML = value.length + " kết quả";
        }
    }
    this.mapView.addEventListener("change-house", function() {
        self.updateResult();
    })
    return temp;
}

MapRealty.prototype.mediaItem = function(data, index) {
    var self = this;
    var temp = _({
        tag: "li",
        class: ["media-stream-tile"],
        on: {
            click: function(event) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    var dataUser = self.checkUserID[data[i].userid];
                    arr.push({
                        index: i,
                        avatar: moduleDatabase.imageAvatarSrc + dataUser.avatar,
                        userName: dataUser.name,
                        src: moduleDatabase.imageAssetSrc + data[i].src,
                        date: data[i].created,
                        note: ""
                    })
                }
                document.body.appendChild(descViewImagePreview(arr, index));
            }
        },
        child: [{
            tag: "img",
            attr: {
                src: moduleDatabase.imageAssetSrc + data[index].src
            }
        }]
    }, )
    return temp;
}

MapRealty.prototype.requestEdit = function(data) {
    var self = this;
    var mNewRealty = new NewRealty(data);
    mNewRealty.attach(self.parent);
    mNewRealty.setRequestEdit();
    mNewRealty.setDataListAccount(self.listAccoutData);
    // mNewRealty.setDataListContact(self.listContactData);
    var frameview = mNewRealty.getView();
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.requestEditDB(mNewRealty, data);
}

MapRealty.prototype.requestEditDB = function(mNewRealty, data) {
    var self = this
    mNewRealty.promiseEditDB.then(function(value) {
        var loading = new loadingWheel();
        moduleDatabase.getModule("modification_requests").add(value).then(function(result) {
            // self.editView(value, data);
            loading.disable();
        })
        mNewRealty.promiseEditDB = undefined;
        setTimeout(function() {
            if (mNewRealty.promiseEditDB !== undefined)
                self.requestEditDB(mNewRealty, data);
        }, 10);
    })
}


MapRealty.prototype.edit = function(data) {
    var self = this;
    var mNewRealty = new NewRealty(data);
    mNewRealty.attach(self.parent);
    mNewRealty.setDataListAccount(self.listAccoutData);
    // mNewRealty.setDataListContact(self.listContactData);
    var frameview = mNewRealty.getView();
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDB(mNewRealty, data);
}


MapRealty.prototype.editDB = function(mNewRealty, data) {
    var self = this
    mNewRealty.promiseEditDB.then(function(value) {
        moduleDatabase.getModule("activehouses").update(value).then(function(result) {
            self.editView(value, data);
        })
        mNewRealty.promiseEditDB = undefined;
        setTimeout(function() {
            if (mNewRealty.promiseEditDB !== undefined)
                self.editDB(mNewRealty, data);
        }, 10);
    })
}

MapRealty.prototype.editView = function(value, data) {

}


MapRealty.prototype.modalLargeRealty = function(data) {
    var self = this;
    var staus = "";
    if (parseInt(data.status) % 10 == 1)
        staus += "Còn bán";
    if (parseInt(parseInt(data.status) / 10) == 1) {
        if (staus == "")
            staus += "Còn cho thuê";
        else
            staus += " và còn cho thuê";
    }
    var imageThumnail = _({
        tag: "img",
        class: ["media-stream-photo", "media-stream-photo--loader"],
    })


    var mediaContainer = _({
        tag: "ul",
        class: "media-stream",
        child: [{
                tag: "li",
                class: ["media-stream-tile", "media-stream-tile--prominent"],
                on: {
                    click: function(event) {
                        var arr = [];
                        if (!modal.image)
                            return;
                        for (var i = 0; i < modal.image.length; i++) {
                            var dataUser = self.checkUserID[modal.image[i].userid];
                            arr.push({
                                index: i,
                                avatar: moduleDatabase.imageAvatarSrc + dataUser.avatar,
                                userName: dataUser.name,
                                src: moduleDatabase.imageAssetSrc + modal.image[i].src,
                                date: modal.image[i].created,
                                note: ""
                            })
                        }
                        document.body.appendChild(descViewImagePreview(arr, modal.indexThumnail));
                    }
                },
                child: [
                    imageThumnail
                ]
            },

        ]
    });
    var mediaContainer2 = _({
        tag: "ul",
        class: "media-stream",
        child: []
    });
    var staticTabbar = _({
        tag: 'statictabbar',
        class: "image-tabcontainer",
        attr: {
            'data-group': 'group1'
        },
        props: {
            items: [{
                    text: 'Ảnh hiện trạng',
                    value: 'status'
                },
                {
                    text: 'Ảnh pháp lý',
                    value: 'juridicals'
                },

            ]
        },
        on: {
            change: function(event) {
                if (this.value == "status") {
                    mediaContainer.style.display = "";
                    mediaContainer2.style.display = "none";
                } else
                if (this.value == "juridicals") {
                    mediaContainer.style.display = "none";
                    mediaContainer2.style.display = "";
                }
            }
        }
    })
    staticTabbar.value = "status";
    staticTabbar.emit("change");
    var fullAddress = "";
    if (data.addressnumber != "" || data.portion != "") {
        var number = data.addressnumber;
        var ward = "",
            district = "",
            state = "";
        if (this.checkStreet[data.streetid])
            var street = this.checkStreet[data.streetid].name;
        else
            var street = "";
        if (data.wardid) {
            var ward = this.checkWard[data.wardid].name;
            var district = this.checkDistrict[this.checkWard[data.wardid].districtid].name;
            var state = this.checkState[this.checkDistrict[this.checkWard[data.wardid].districtid].stateid].name;
        }
        fullAddress = number + " " + street + ", " + ward + ", " + district + ", " + state;
    }
    var statusIcon = _({
        tag: "i",
        class: ["material-icons", "list-card-type-icon", "zsg-icon-for-sale"],
        props: {
            innerHTML: "brightness_1"
        }
    });

    switch (parseInt(data.status)) {
        case 0:
            statusIcon.style.color = "yellow"
            break;
        case 1:
            statusIcon.style.color = "red"
            break;
        case 10:
            statusIcon.style.color = "blue"
            break;
        case 11:
            statusIcon.style.color = "purple"
            break;
        default:
            statusIcon.style.color = "yellow"
    }
    self.buttonRange = _({
        tag: 'buttonrange',
        props: {
            items: [
                { text: "Thông tin chung", value: 0 },
                { text: "Thông tin xây dựng", value: 1 },
                { text: "Giá", value: 2 },
                { text: "Tiện ích trong nhà", value: 3 },
                { text: "Thông tin liên hệ", value: 4 },
                { text: "Pháp lý", value: 5 },
                { text: "Lịch sử sở hữu", value: 6 },
            ]
        },
        on: {
            change: function(event) {
                self.detailHouseView.childNodes[this.value].childNodes[0].scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
            }
        }
    });
    self.detailHouseView = self.detailHouse(data);
    var modal = _({
        tag: "modal",
        attr: {
            tabindex: 1
        },
        child: [{
            tag: "div",
            class: ["active-hdp-col", "yui3-app-views", "app-view-hdp"],
            child: [{
                tag: "div",
                class: ["active-view", "preload-lightbox"],
                child: [{
                    tag: "div",
                    class: "home-details-render",
                    child: [{
                        tag: "div",
                        class: "home-details-content",
                        child: [{
                                tag: "button",
                                class: ["ds-close-lightbox-icon", "hc-back-to-list"],
                                on: {
                                    click: function(event) {
                                        modal.selfRemove();
                                    }
                                },
                                child: [{
                                    tag: "i",
                                    style: {
                                        fontSize: "2rem",
                                        color: "white"
                                    },
                                    class: "material-icons",
                                    props: {
                                        innerHTML: "close"
                                    }
                                }]
                            },
                            {
                                tag: "div",
                                class: ["ds-wrapper", "znav-force-mobile-layout"],
                                child: [{
                                    tag: "div",
                                    class: ["ds-container", "ds-mobile-single-scroll", "ds-container-lightboxed", "is-data-forward"],
                                    child: [{
                                            tag: "div",
                                            class: ["ds-media-col", "ds-media-col-hidden-mobile"],
                                            child: [
                                                staticTabbar,
                                                mediaContainer,
                                                mediaContainer2
                                                //    {
                                                //         tag: 'frameview',
                                                //         child: [
                                                //             {
                                                //                 tag: 'singlepage',
                                                //                 id: 'frame-status',
                                                //                 child:[
                                                //                     mediaContainer
                                                //                 ]
                                                //             },
                                                //             {
                                                //                 tag: 'singlepage',
                                                //                 id: 'frame-juridicals',
                                                //                 child:[
                                                //                     mediaContainer2
                                                //                 ]
                                                //             }
                                                //         ]
                                                //    }
                                                ///media container
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: ["ds-data-col", "ds-white-bg", "ds-data-col-data-forward"],
                                            child: [{
                                                    tag: "div",
                                                    class: ["sc-bAeIUo", "bhsEJe"],
                                                    child: [{
                                                        tag: "div",
                                                        class: ["sc-1tf5ijk-9", "fAdunC", "ds-action-bar"],
                                                        child: [{
                                                            tag: "nav",
                                                            class: ["sc-exAgwC", "imHfmq"],
                                                            child: [{
                                                                    tag: "div",
                                                                    class: "pizo-header-logo",
                                                                    child: [{
                                                                            tag: "img",
                                                                            class: "pizo-header-logo-icon",
                                                                            attr: {
                                                                                src: "assets/images/logo.png"
                                                                            }
                                                                        },
                                                                        {
                                                                            tag: "img",
                                                                            class: "pizo-header-logo-text",
                                                                            attr: {
                                                                                src: "assets/images/logo-text-blue.png"
                                                                            }
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    tag: "ul",
                                                                    class: ["sc-GMQeP", "cjrQwi"],
                                                                    child: [{
                                                                            tag: "li",
                                                                            class: ["sc-cLQEGU-1", "cllLJF"],
                                                                            child: [{
                                                                                tag: "button",
                                                                                class: ["sc-bdVaJa", "gpVNOz"],
                                                                                on: {
                                                                                    click: function(event) {
                                                                                        if (this.check) {
                                                                                            this.check = undefined;
                                                                                            this.childNodes[0].childNodes[0].childNodes[0].innerHTML = "favorite_border";
                                                                                            var loading = new loadingWheel();
                                                                                            moduleDatabase.getModule("favourite").delete({ userid: window.userid, houseid: data.id }).then(function() {
                                                                                                loading.disable();
                                                                                                moduleDatabase.getModule("activehouses").load().then(function(value) {
                                                                                                    if (moduleDatabase.stackUpdateFavourite) {
                                                                                                        for (var i = 0; i < moduleDatabase.stackUpdateFavourite.length; i++) {
                                                                                                            moduleDatabase.stackUpdateFavourite[i].mTable.updateTable(undefined, moduleDatabase.stackUpdateFavourite[i].formatDataRow(value));
                                                                                                        }
                                                                                                    }
                                                                                                })
                                                                                            });
                                                                                        } else {
                                                                                            this.check = true;
                                                                                            this.childNodes[0].childNodes[0].childNodes[0].innerHTML = "favorite";
                                                                                            var loading = new loadingWheel();
                                                                                            moduleDatabase.getModule("favourite").add({ userid: window.userid, houseid: data.id }).then(function() {
                                                                                                loading.disable();
                                                                                                moduleDatabase.getModule("activehouses").load().then(function(value) {
                                                                                                    if (moduleDatabase.stackUpdateFavourite) {
                                                                                                        for (var i = 0; i < moduleDatabase.stackUpdateFavourite.length; i++) {
                                                                                                            moduleDatabase.stackUpdateFavourite[i].mTable.updateTable(undefined, moduleDatabase.stackUpdateFavourite[i].formatDataRow(value));
                                                                                                        }
                                                                                                    }
                                                                                                })
                                                                                            });
                                                                                        }
                                                                                    }
                                                                                },
                                                                                child: [{
                                                                                    tag: "div",
                                                                                    class: ["sc-bMVAic", "gpVNOz"],
                                                                                    child: [{
                                                                                            tag: "div",
                                                                                            class: ["sc-gqPbQI", "eKDTCE"],
                                                                                            child: [{
                                                                                                tag: "i",
                                                                                                class: "material-icons",
                                                                                                props: {
                                                                                                    innerHTML: "favorite_border"
                                                                                                }
                                                                                            }]
                                                                                        },
                                                                                        {
                                                                                            tag: "span",
                                                                                            class: ["sc-hORach", "duJWoc"],
                                                                                            props: {
                                                                                                innerHTML: " Yêu thích"
                                                                                            }
                                                                                        }
                                                                                    ]
                                                                                }]
                                                                            }]
                                                                        },
                                                                        {
                                                                            tag: "li",
                                                                            class: ["sc-cLQEGU-2", "cllLJF"],
                                                                            style: {
                                                                                display: "none"
                                                                            },
                                                                            child: [{
                                                                                tag: "button",
                                                                                class: ["sc-bMVAic", "gpVNOz"],
                                                                                on: {
                                                                                    click: function() {
                                                                                        self.requestEdit({ original: data });
                                                                                        modal.selfRemove();
                                                                                    }
                                                                                },
                                                                                child: [{
                                                                                        tag: "div",
                                                                                        class: ["sc-gqPbQI", "eKDTCE"],
                                                                                        child: [{
                                                                                            tag: "i",
                                                                                            class: "material-icons",
                                                                                            props: {
                                                                                                innerHTML: "edit"
                                                                                            }
                                                                                        }]
                                                                                    },
                                                                                    {
                                                                                        tag: "span",
                                                                                        class: ["sc-hORach", "duJWoc"],
                                                                                        props: {
                                                                                            innerHTML: "Yêu cầu chỉnh sửa"
                                                                                        }
                                                                                    }
                                                                                ]
                                                                            }]
                                                                        },
                                                                        {
                                                                            tag: "li",
                                                                            class: ["sc-cLQEGU-3", "cllLJF"],
                                                                            style: {
                                                                                display: "none"
                                                                            },
                                                                            child: [{
                                                                                tag: "button",
                                                                                class: ["sc-bMVAic", "gpVNOz"],
                                                                                on: {
                                                                                    click: function() {
                                                                                        self.edit({ original: data });
                                                                                        modal.selfRemove();
                                                                                    }
                                                                                },
                                                                                child: [{
                                                                                        tag: "div",
                                                                                        class: ["sc-gqPbQI", "eKDTCE"],
                                                                                        child: [{
                                                                                            tag: "i",
                                                                                            class: "material-icons",
                                                                                            props: {
                                                                                                innerHTML: "edit"
                                                                                            }
                                                                                        }]
                                                                                    },
                                                                                    {
                                                                                        tag: "span",
                                                                                        class: ["sc-hORach", "duJWoc"],
                                                                                        props: {
                                                                                            innerHTML: "Sửa"
                                                                                        }
                                                                                    }
                                                                                ]
                                                                            }]
                                                                        },
                                                                        //    {
                                                                        //        tag:"li",
                                                                        //        class:["sc-bMVAic", "bzoMbE"],
                                                                        //        child:[
                                                                        //             {
                                                                        //                 tag:"button",
                                                                        //                 class:["sc-bMVAic", "gpVNOz"],
                                                                        //                 child:[
                                                                        //                     {
                                                                        //                         tag:"div",
                                                                        //                         class:["sc-gqPbQI", "eKDTCE"],
                                                                        //                         child:[
                                                                        //                             {
                                                                        //                                 tag:"i",
                                                                        //                                 class:"material-icons",
                                                                        //                                 props:{
                                                                        //                                     innerHTML:"more_horiz"
                                                                        //                                 }
                                                                        //                             }
                                                                        //                         ]
                                                                        //                     },
                                                                        //                     {
                                                                        //                         tag:"span",
                                                                        //                         class:["sc-hORach", "duJWoc"],
                                                                        //                         props:{
                                                                        //                             innerHTML:"More"
                                                                        //                         }
                                                                        //                     }
                                                                        //                 ]
                                                                        //             }
                                                                        //        ]
                                                                        //    }
                                                                    ]
                                                                }
                                                            ]
                                                        }]
                                                    }]
                                                },
                                                {
                                                    tag: "div",
                                                    class: "ds-data-col-container",
                                                    child: [{
                                                            tag: "div",
                                                            class: ["ds-data-col", "ds-white-bg", "ds-data-col-data-forward"],
                                                            child: [{
                                                                    tag: "div",
                                                                    class: "ds-chip",
                                                                    child: [{
                                                                        tag: "div",
                                                                        class: "ds-home-details-chip",
                                                                        child: [{
                                                                                tag: "div",
                                                                                class: "ds-summary-row-container",
                                                                                child: [{
                                                                                    tag: "div",
                                                                                    class: "ds-summary-row-content",
                                                                                    child: [{
                                                                                        tag: "div",
                                                                                        class: "ds-summary-row",
                                                                                        child: [{
                                                                                                tag: "h3",
                                                                                                class: "ds-price",
                                                                                                child: [{
                                                                                                    tag: "span",
                                                                                                    class: "ds-value",
                                                                                                    props: {
                                                                                                        innerHTML: "VND " + (data.price / 1000000000) + " tỉ"
                                                                                                    }
                                                                                                }]
                                                                                            },
                                                                                            {
                                                                                                tag: "header",
                                                                                                class: "ds-bed-bath-living-area-header",
                                                                                                child: [{
                                                                                                    tag: "h3",
                                                                                                    class: ["ds-bed-bath-living-area-container"],
                                                                                                    child: [{
                                                                                                            tag: "span",
                                                                                                            class: "ds-bed-bath-living-area",
                                                                                                            child: [{
                                                                                                                    tag: "span",
                                                                                                                    props: {
                                                                                                                        innerHTML: data.width
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    tag: "span",
                                                                                                                    class: "ds-summary-row-label-secondary",
                                                                                                                    props: {
                                                                                                                        innerHTML: "m"
                                                                                                                    }
                                                                                                                }
                                                                                                            ]
                                                                                                        },
                                                                                                        {
                                                                                                            tag: "span",
                                                                                                            class: "ds-vertical-divider",
                                                                                                            props: {
                                                                                                                innerHTML: "x"
                                                                                                            }
                                                                                                        },
                                                                                                        {
                                                                                                            tag: "button",
                                                                                                            class: ["TriggerText-sc-139r5uq-0", "jfjsxZ", "TooltipPopper-io290n-0", "sc-jlyJG", "eVrWvb"],
                                                                                                            child: [{
                                                                                                                tag: "span",
                                                                                                                class: "ds-bed-bath-living-area",
                                                                                                                child: [{
                                                                                                                        tag: "span",
                                                                                                                        props: {
                                                                                                                            innerHTML: data.height
                                                                                                                        }
                                                                                                                    },
                                                                                                                    {
                                                                                                                        tag: "span",
                                                                                                                        class: "ds-summary-row-label-secondary",
                                                                                                                        props: {
                                                                                                                            innerHTML: "m"
                                                                                                                        }
                                                                                                                    }
                                                                                                                ]

                                                                                                            }]
                                                                                                        },
                                                                                                        {
                                                                                                            tag: "span",
                                                                                                            class: "ds-vertical-divider",
                                                                                                            props: {
                                                                                                                innerHTML: "|"
                                                                                                            }
                                                                                                        },
                                                                                                        {
                                                                                                            tag: "span",
                                                                                                            class: "ds-bed-bath-living-area",
                                                                                                            child: [{
                                                                                                                    tag: "span",
                                                                                                                    props: {
                                                                                                                        innerHTML: data.acreage
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    tag: "span",
                                                                                                                    class: "ds-summary-row-label-secondary",
                                                                                                                    props: {
                                                                                                                        innerHTML: "m²"
                                                                                                                    }
                                                                                                                }
                                                                                                            ]
                                                                                                        }
                                                                                                    ]
                                                                                                }]
                                                                                            }
                                                                                        ]
                                                                                    }]
                                                                                }]
                                                                            },
                                                                            {
                                                                                tag: "div",
                                                                                class: "ds-price-change-address-row",
                                                                                child: [{
                                                                                    tag: "header",
                                                                                    child: [{
                                                                                        tag: "h1",
                                                                                        class: "ds-address-container",
                                                                                        child: [{
                                                                                            tag: "span",
                                                                                            props: {
                                                                                                innerHTML: fullAddress
                                                                                            }
                                                                                        }]
                                                                                    }]
                                                                                }]
                                                                            },
                                                                            {
                                                                                tag: "div",
                                                                                class: ["sc-hIVACf", "eiqksm", "ds-chip-removable-content"],
                                                                                style: {
                                                                                    visibility: "visible",
                                                                                    height: "19px",
                                                                                    opacity: 1
                                                                                },
                                                                                child: [{
                                                                                    tag: "p",
                                                                                    class: ["Text-aiai24-0", "StyledParagraph-sc-18ze78a-0", "dDDkWA", "sc-fgfRvd", "hmPfMB"],
                                                                                    child: [{
                                                                                        tag: "span",
                                                                                        class: ["sc-likbZx", "ccUlrP", "ds-status-details"],
                                                                                        child: [
                                                                                            statusIcon,
                                                                                            {
                                                                                                tag: "span",
                                                                                                props: {
                                                                                                    innerHTML: staus
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                    }]
                                                                                }]
                                                                            }
                                                                        ]
                                                                    }]
                                                                },
                                                                self.buttonRange,
                                                                self.detailHouseView,
                                                            ]
                                                        },
                                                        {
                                                            tag: "div",
                                                            class: ["ds-data-col", "ds-white-bg", "ds-data-col-data-forward"],
                                                            child: [{
                                                                tag: "div",
                                                                class: "pizo-new-realty-dectruct-tab-ownership-history",
                                                                child: [{
                                                                        tag: "div",
                                                                        class: "pizo-new-realty-dectruct-tab",
                                                                        props: {
                                                                            innerHTML: "Ghi chú"
                                                                        }
                                                                    },
                                                                    {
                                                                        tag: "div",
                                                                        class: "note-data",
                                                                        child: []
                                                                    },
                                                                    {
                                                                        tag: "div",
                                                                        class: "form-group",
                                                                        child: [{
                                                                                tag: "label",
                                                                                class: "message-support"
                                                                            },
                                                                            {
                                                                                tag: "textarea",
                                                                                class: "form-control",
                                                                                props: {
                                                                                    required: "",
                                                                                    placeholder: "Nhập ghi chú..."
                                                                                }
                                                                            },
                                                                            {
                                                                                tag: "button",
                                                                                class: ["btn", "btn-info", "btn-xs", "add-note-land"],
                                                                                props: {
                                                                                    innerHTML: "Thêm ghi chú"
                                                                                },
                                                                                on: {
                                                                                    click: function(event) {
                                                                                        var textarea = $("textarea.form-control", modal);
                                                                                        var value = {
                                                                                            userid: window.userid,
                                                                                            houseid: data.id,
                                                                                            content: textarea.value,
                                                                                            created: new Date()
                                                                                        }
                                                                                        textarea.value = "";
                                                                                        var loading = new loadingWheel();
                                                                                        moduleDatabase.getModule("activehouses_note").add(value).then(function() {
                                                                                            loading.disable();
                                                                                            modal.updateChat();
                                                                                        })
                                                                                    }
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }, ]
                                                        }
                                                    ]
                                                }

                                                //    {
                                                //        tag:"div",
                                                //        class:"ds-buttons",
                                                //        child:[
                                                //            {
                                                //                tag:"ul",
                                                //                class:"contact-button-group",
                                                //                child:[
                                                //                    {
                                                //                        tag:"li",
                                                //                        class:"contact-button",
                                                //                        child:[
                                                //                            {
                                                //                                tag:"button",
                                                //                                class:["Button-wpcbcc-0", "cpEtCH", "contact-button-condensed", "ds-button", "ds-label-small"],
                                                //                                props:{
                                                //                                    innerHTML:"Liên lạc với nhân viên"
                                                //                                }
                                                //                            }
                                                //                        ]
                                                //                    },
                                                //                    {
                                                //                        tag:"li",
                                                //                        class:"contact-button",
                                                //                        child:[
                                                //                            {
                                                //                                tag:"button",
                                                //                                class:["Button-wpcbcc-0", "btcvqQ", "contact-button-condensed", "ds-button", "ds-label-small"],
                                                //                                props:{
                                                //                                 innerHTML:"Đặt tour thăm quan"
                                                //                                 }
                                                //                            }
                                                //                        ]
                                                //                    }
                                                //                ]
                                                //            }
                                                //        ]
                                                //    }
                                            ]
                                        },


                                    ]
                                }]
                            }
                        ]
                    }]
                }]
            }]
        }]
    })

    var containerChat = $(".note-data", modal);
    modal.updateChat = function() {
        moduleDatabase.getModule("activehouses_note").load({ WHERE: [{ houseid: data.id }] }, true).then(function(value) {
            containerChat.clearChild();
            for (var i = 0; i < value.length; i++) {
                containerChat.appendChild(self.noteChat(value[i]));
            }
        })
    }
    modal.updateChat();

    var src = moduleDatabase.imageThumnail;
    if (data !== undefined) {
        moduleDatabase.getModule("image").load({ WHERE: [{ houseid: data.id }] }).then(function(values) {
            var m;
            for (var i = 0; i < values.length; i++) {
                m = i;
                if (src == moduleDatabase.imageThumnail && values[i].type == 1) {
                    src = moduleDatabase.imageAssetSrc + values[i].src;
                }
                if (values[i].thumnail == 1) {
                    src = moduleDatabase.imageAssetSrc + values[i].src;
                    break;
                }
            }
            imageThumnail.setAttribute("src", src);
            var arrTemp = [];
            var arrTemp2 = [];
            var k = 0;
            var m = 0;
            for (var i = 0; i < values.length; i++) {
                if (values[i].type == 1) {
                    arrTemp.push(values[i]);
                    if (m != i)
                        mediaContainer.appendChild(self.mediaItem(arrTemp, k));
                    else
                        modal.indexThumnail = k;
                    k++;
                } else if (values[i].type == 0) {
                    arrTemp2.push(values[i]);
                    mediaContainer2.appendChild(self.mediaItem(arrTemp2, m));
                    m++;
                }
            }
            modal.image = arrTemp;
            imageThumnail.setAttribute("src", src);
        })
    }
    imageThumnail.setAttribute("src", src);

    var functionESC = function(event) {
        if (event.keyCode == 27) {
            modal.selfRemove();
            var arr = document.body.getElementsByClassName("as-modal");
            console.log(arr)
            if (arr.length > 0) {
                arr[arr.length - 1].focus();
            }
        }
    }
    modal.addEventListener("keydown", functionESC);
    setTimeout(function() {
        modal.focus();
    }, 100);
    var requestEdit = $("li.sc-cLQEGU-2", modal);
    var realEdit = $("li.sc-cLQEGU-3", modal);
    var isEdit = false;
    var isRequest = false;
    Loop: for (var param in moduleDatabase.checkPermission) {
        var object = JSON.parse(param);
        for (var objectParam in object) {
            if (object[objectParam] !== data[objectParam]) {
                continue Loop;
            }
        }
        if (moduleDatabase.checkPermission[param].indexOf(58) !== -1) {
            isEdit = true;
        }
        if (moduleDatabase.checkPermission[param].indexOf(68) !== -1) {
            isRequest = true;
        }
    }
    if (isEdit) {
        realEdit.style.display = "";
    } else {
        realEdit.style.display = "none";
        if (isRequest) {
            requestEdit.style.display = "";
        } else
            requestEdit.style.display = "none";
    }
    var checkButton = $(".sc-bdVaJa.gpVNOz", modal);
    var checkHouseId = moduleDatabase.getModule("favourite").getLibary("houseid");
    if (checkHouseId[data.id]) {
        checkButton.childNodes[0].childNodes[0].childNodes[0].innerHTML = "favorite";
        checkButton.check = true;
    }
    return modal;
}

MapRealty.prototype.itemCount = function(data) {
    var input = _({
        tag: "input",
        class: ["pizo-new-realty-dectruct-content-area-floor", "pizo-new-realty-dectruct-input"],
        attr: {
            type: "number",
            min: 0,
            step: 1
        },
        props: {
            value: 1
        }
    });
    if (data.content !== undefined) {
        input.value = data.content;
    }
    var temp = _({
        tag: "div",
        class: ["pizo-new-realty-dectruct-content-area-size-zone-all"],
        child: [{
            tag: "div",
            class: "pizo-new-realty-desc-detail-row",
            child: [{
                    tag: "span",
                    class: "pizo-new-realty-dectruct-content-area-floor-label",
                    props: {
                        innerHTML: data.name,
                    },
                },
                input
            ]
        }]
    });
    temp.equipmentid = data.id;
    temp.getData = function() {
        var result = {
            equipmentid: data.id,
            content: input.value
        }
        return result;
    }
    return temp;
}

MapRealty.prototype.itemDisplayNone = function(data) {
    var temp = _({
        tag: "div",
        style: {
            display: "none"
        }
    })
    temp.equipmentid = data.id;
    temp.getData = function() {
        var result = {
            equipmentid: data.id,
            content: data.content
        }
        return result;
    }
    return temp;
}

MapRealty.prototype.convenientView = function(data) {
    var self = this;
    var dataEquipments = moduleDatabase.getModule("equipments").data;
    var arr = [];
    for (var i = 0; i < dataEquipments.length; i++) {
        if (dataEquipments[i].available === 0)
            continue;
        arr.push({ text: dataEquipments[i].name, value: dataEquipments[i].id, data: dataEquipments[i] })
    }
    var container = _({
        tag: "div",
        class: "pizo-new-realty-dectruct-content-area-size"
    })
    var equipment = _({
        tag: "selectbox",
        style: {
            width: "100%",
            pointerEvents: "none"
        },
        props: {
            items: arr,
            enableSearch: true
        },
        on: {
            add: function(event) {
                switch (parseInt(event.itemData.data.type)) {
                    case 0:
                        container.appendChild(self.itemCount(event.itemData.data));
                        break;
                    case 1:
                        container.appendChild(self.itemDisplayNone(event.itemData.data));
                        break;
                }
            },
            remove: function(event) {
                for (var i = 0; i < container.childNodes.length; i++) {
                    if (container.childNodes[i].equipmentid == event.itemData.data.id) {
                        container.childNodes[i].selfRemove();
                        break;
                    }
                }
            }
        }
    });

    if (data !== undefined) {
        var value = [];
        var temp;
        var libary = moduleDatabase.getModule("equipments").getLibary("id");
        moduleDatabase.getModule("house_equipments").load({ WHERE: [{ houseid: data.id }] }).then(function(values) {
            for (var i = 0; i < values.length; i++) {
                temp = libary[values[i].equipmentid];
                temp.content = values[i].content;
                value.push(values[i].equipmentid);
                switch (parseInt(temp.type)) {
                    case 0:
                        if (temp.available == 1)
                            container.appendChild(self.itemCount(temp));
                        else
                            container.appendChild(self.itemDisplayNone(temp));
                        break;
                    case 1:
                        container.appendChild(self.itemDisplayNone(temp));
                        break;
                }
            }
            equipment.values = value;
        })

    }

    var temp = _({
        tag: "div",
        class: "pizo-new-realty-convenient",
        child: [{
                tag: "div",
                class: "pizo-new-realty-convenient-tab",
                props: {
                    innerHTML: "Tiện ích trong nhà"
                }
            },
            {
                tag: "div",
                class: "pizo-new-realty-convenient-content",
                child: [{
                        tag: "div",
                        class: "pizo-new-realty-convenient-content-size",
                        child: [
                            equipment
                        ]
                    },
                    container
                ]
            }
        ]
    })
    this.containerEquipment = container;
    return temp;
}

MapRealty.prototype.contactView = function(data) {
    var self = this;
    var containerContact = _({
        tag: "div",
        class: "pizo-new-realty-contact-content",
        child: []
    });
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-contact",
        child: [{
                tag: "div",
                class: "pizo-new-realty-contact-tab",
                child: [{
                        tag: "span",
                        class: "pizo-new-realty-contact-tab-label",
                        props: {
                            innerHTML: "Thông tin liên hệ"
                        }
                    },
                    // {
                    //     tag:"button",
                    //     class:"pizo-new-realty-contact-tab-button",
                    //     on:{
                    //         click:function(event){
                    //             containerContact.appendChild(self.contactItem());

                    //         }
                    //     },
                    //     child:[
                    //         {
                    //             tag:"i",
                    //             class:"material-icons",
                    //             style:{
                    //                 fontSize:"1rem"
                    //             },
                    //             props:{
                    //                 innerHTML:"add"
                    //             }
                    //         }
                    //     ]
                    // }
                ]
            },
            containerContact
        ]
    })
    if (data !== undefined) {
        moduleDatabase.getModule("contact_link").load({ WHERE: [{ houseid: data.id }] }).then(function(values) {
            for (var i = 0; i < values.length; i++) {
                containerContact.appendChild(self.contactItem(values[i]));
            }
        })
    }
    this.containerContact = containerContact;

    return temp;
}

MapRealty.prototype.juridicalView = function(data) {
    var arr = moduleDatabase.getModule("juridicals").getList("name", "id");
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-juridical",
        child: [{
                tag: "div",
                class: "pizo-new-realty-juridical-tab",
                props: {
                    innerHTML: "Pháp lý"
                }
            },
            {
                tag: "div",
                class: "pizo-new-realty-juridical-content",
                child: [{
                    tag: "div",
                    class: "pizo-new-realty-dectruct-content-area-right",
                    child: [{
                            tag: "span",
                            class: "pizo-new-realty-detruct-content-area-label",
                            props: {
                                innerHTML: "Tình trạng"
                            },
                        },
                        {
                            tag: "selectmenu",
                            class: ["pizo-new-realty-dectruct-content-area-fit", "pizo-new-realty-dectruct-input"],
                            props: {
                                items: arr
                            }
                        }
                    ]
                }, ]
            }
        ]
    })
    this.juridical = $('div.pizo-new-realty-dectruct-content-area-fit.pizo-new-realty-dectruct-input', temp);
    if (data !== undefined) {
        this.juridical.value = data.juridical;
    }
    return temp;
}

MapRealty.prototype.contactItem = function(data) {
    var name, typecontact, phone, statusphone, note;
    var self = this;
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-contact-item",
        child: [{
                tag: "div",
                class: "pizo-new-realty-contact-item-name",
                child: [{
                        tag: "span",
                        class: "pizo-new-realty-contact-item-name-label",
                        props: {
                            innerHTML: "Tên"
                        }
                    },
                    {
                        tag: "input",
                        class: "pizo-new-realty-contact-item-name-input",
                        props: {}
                    },
                    {
                        tag: "selectmenu",
                        class: "pizo-new-realty-contact-item-name-selectbox",
                        props: {
                            items: [
                                { text: "Chưa xác định", value: 0 },
                                { text: "Môi giới", value: 1 },
                                { text: "Chủ nhà", value: 2 },
                                { text: "Họ hàng", value: 3 }
                            ]
                        }
                    },
                    {
                        tag: "button",
                        class: "pizo-new-realty-contact-item-setting",
                        on: {
                            click: function(event) {
                                var tempData = temp.getData();
                                if (tempData.username !== undefined)
                                    self.editAccount(temp, tempData);
                                else
                                    self.editContact(temp, tempData);
                            }
                        },
                        child: [{
                            tag: "i",
                            class: "material-icons",
                            style: {
                                fontSize: "1rem",
                                verticalAlign: "middle"
                            },
                            props: {
                                innerHTML: "settings"
                            }
                        }]
                    },
                    {
                        tag: "button",
                        class: "pizo-new-realty-contact-item-close",
                        on: {
                            click: function(event) {
                                temp.selfRemove();
                            }
                        },
                        child: [{
                            tag: "i",
                            class: "material-icons",
                            style: {
                                fontSize: "1rem",
                                verticalAlign: "middle"
                            },
                            props: {
                                innerHTML: "close"
                            }
                        }]
                    }
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-contact-item-phone",
                child: [{
                        tag: "span",
                        class: "pizo-new-realty-contact-item-phone-label",
                        props: {
                            innerHTML: "Số điện thoại"
                        }
                    },
                    {
                        tag: "span",
                        class: "pizo-new-realty-contact-item-phone-input",
                        style: {
                            pointerEvents: "unset",
                            cursor: "pointer"
                        },
                        props: {
                            type: "number"
                        },
                        on: {
                            click: function(event) {
                                if (this.isCheck) {
                                    this.innerText = "xxxxxxxxxx";
                                    this.isCheck = false;
                                } else {
                                    this.innerText = this.realValue;
                                    this.isCheck = true;
                                }
                            }
                        }
                    },
                    {
                        tag: "selectmenu",
                        class: "pizo-new-realty-contact-item-phone-selectbox",
                        style: {
                            width: "190px"
                        },
                        props: {
                            items: [
                                { text: "Còn hoạt động", value: 0 },
                                { text: "Sai số", value: 1 },
                                { text: "Gọi lại sau", value: 2 },
                                { text: "Bỏ qua", value: 3 },
                                { text: "Khóa máy", value: 4 }
                            ]
                        }
                    }
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-contact-item-note",
                child: [{
                        tag: "span",
                        class: "pizo-new-realty-contact-item-note-label",
                        props: {
                            innerHTML: "Ghi chú"
                        }
                    },
                    {
                        tag: "textarea",
                        class: "pizo-new-realty-contact-item-note-input"
                    }
                ]
            },
        ]
    })
    var name = $('input.pizo-new-realty-contact-item-name-input', temp);
    var typecontact = $('div.pizo-new-realty-contact-item-name-selectbox', temp);
    var phone = $('span.pizo-new-realty-contact-item-phone-input', temp);
    var statusphone = $('div.pizo-new-realty-contact-item-phone-selectbox', temp);
    var note = $('textarea.pizo-new-realty-contact-item-note-input', temp);
    phone.checkContact = function(data) {
        if (self.checkUserID === undefined) {
            var element = this;
            moduleDatabase.getModule("users").load().then(function() {
                setTimeout(function() {
                    element.checkContact(data);
                }, 10)
            })
            return;
        }
        if (data.contactid !== undefined && data.contactid != 0) {
            moduleDatabase.getModule("contacts").load({ WHERE: [{ id: data.contactid }] }).then(function(value) {
                var tempValue = value[0];
                temp.setInformation(tempValue);
            })
        } else
        if (data.userid !== undefined && data.userid != 0) {
            temp.setInformation(self.checkUserID[data.userid]);
        } else {
            temp.setInformation(data);
        }
    }
    temp.setInformation = function(data) {
        if (data === undefined) {
            temp.selfRemove();
            return;
        }
        temp.data = data;
        if (data.statusphone === undefined)
            statusphone.value = 1
        else
            statusphone.value = data.statusphone;
        phone.innerText = "xxxxxxxxxx";
        phone.realValue = data.phone;
        name.value = data.name;
        name.setAttribute("disabled", "");
        statusphone.style.pointerEvents = "none";
        statusphone.style.backgroundColor = "#f3f3f3";
    }
    temp.setOpenForm = function(data) {
        temp.data = data;
        statusphone.value = 1;
        name.removeAttribute("disabled");
        statusphone.style.pointerEvents = "unset";
        statusphone.style.backgroundColor = "unset";
    }
    temp.getData = function() {
        if (temp.data !== undefined) {
            temp.data.typecontact = typecontact.value;
            temp.data.note = note.value;
            return temp.data;
        } else {
            return {
                name: name.value,
                statusphone: statusphone.value,
                phone: phone.value,
                typecontact: typecontact.value,
                note: note.value
            }
        }
    }

    if (data !== undefined) {
        phone.checkContact(data);
        typecontact.value = data.typecontact;
        note.value = data.note;
    }

    return temp;
}

MapRealty.prototype.detailHouse = function(data) {
    var unitHeight = unit_Long(function(event) {
        var height = $('input.pizo-new-realty-dectruct-content-area-height', temp);
        height.value = height.value * event.lastValue / event.value;
    });
    var unitWidth = unit_Long(function(event) {
        var width = $('input.pizo-new-realty-dectruct-content-area-width', temp);
        width.value = width.value * event.lastValue / event.value;
    })
    var unit_Zone_1 = unit_Zone(function(event) {
        var area1 = $('input.pizo-new-realty-dectruct-content-area-1', temp);
        area1.value = area1.value * event.lastValue / event.value;
    });
    var unit_Zone_2 = unit_Zone(function(event) {
        var area2 = $('input.pizo-new-realty-dectruct-content-area-2', temp);
        area2.value = area2.value * event.lastValue / event.value;
    });
    var unit_Zone_all = unit_Zone(function(event) {
        var area2 = $('pizo-new-realty-dectruct-content-area-all', temp);
        area2.value = area2.value * event.lastValue / event.value;
    });
    var unitWidthRoad = unit_Long(function(event) {
        var width = $('input.pizo-new-realty-dectruct-content-area-access', temp);
        width.value = width.value * event.lastValue / event.value;
    })
    var self = this;
    var unitMoney = moduleDatabase.getModule("unit_money").getList("name", "coefficient");
    unitMoney = [...unitMoney];
    unitMoney.unshift({ text: "VND", value: 1 });
    var priceRent = _({
        tag: "div",
        class: "pizo-new-realty-dectruct-content-area-right",
        child: [{
            tag: "div",
            class: "pizo-new-realty-desc-detail-row",
            child: [{
                    tag: "span",
                    class: ["pizo-new-realty-detruct-content-price-rent-label", "pizo-new-realty-detruct-content-area-label"],
                    props: {
                        innerHTML: "Giá thuê tháng"
                    },
                },
                {
                    tag: "input",
                    class: ["pizo-new-realty-detruct-content-price-rent", "pizo-new-realty-dectruct-input"],
                    on: {
                        input: function(event) {
                            this.value = formatNumber(this.value);
                        },
                        blur: function(event) {
                            this.value = reFormatNumber(this.value);
                        }
                    }
                },
                {
                    tag: "selectmenu",
                    class: "pizo-new-realty-detruct-content-price-rent-unit",
                    on: {
                        change: function(event) {
                            var price = $('input.pizo-new-realty-detruct-content-price-rent', temp);
                            price.value = (price.value * event.lastValue / event.value);
                        }
                    },
                    props: {
                        value: 1,
                        items: unitMoney
                    }
                }
            ]
        }]
    });
    if (data.status / 10 < 1) {
        priceRent.style.display = "none";
    }
    var fullAddressOld = "";
    if (data.addressnumber_old !== "") {
        var number = data.addressnumber_old;
        var street = "";
        var ward = "",
            district = "",
            state = "";
        if (this.checkStreet[data.streetid_old])
            street = this.checkStreet[data.streetid_old].name;
        else
            street = "";
        if (this.checkWard[data.wardid_old]) {
            var ward = this.checkWard[data.wardid_old].name;
            var district = this.checkDistrict[this.checkWard[data.wardid_old].districtid].name;
            var state = this.checkState[this.checkDistrict[this.checkWard[data.wardid_old].districtid].stateid].name;
        }
        fullAddressOld = number + " " + street + ", " + ward + ", " + district + ", " + state;
    }
    var oldAddress = _({
        tag: "div",
        class: "pizo-new-realty-dectruct-content-area-right",
        child: [{
                tag: "span",
                class: "pizo-new-realty-detruct-content-area-label",
                style: {
                    width: "70px"
                },
                child: [
                    { text: "Địa chỉ cũ" }
                ]
            },
            {
                tag: "input",
                class: ["pizo-new-realty-dectruct-input"],
                props: {
                    value: fullAddressOld
                }
            }

        ]
    });
    var fullName = data.name;
    var name = _({
        tag: "div",
        class: "pizo-new-realty-dectruct-content-area-right",
        child: [{
                tag: "span",
                class: "pizo-new-realty-detruct-content-area-label",
                style: {
                    width: "70px"
                },
                child: [
                    { text: "Tên" }
                ]
            },
            {
                tag: "input",
                class: ["pizo-new-realty-dectruct-input"],
                props: {
                    value: fullName
                }
            }

        ]
    });
    var fullDesc = data.content;
    var desc = _({
        tag: "div",
        class: "pizo-new-realty-dectruct-content-area-right",
        child: [{
                tag: "span",
                class: "pizo-new-realty-detruct-content-area-label",
                style: {
                    width: "70px"
                },
                child: [
                    { text: "Mô tả" }
                ]
            },
            {
                tag: "span",
                class: ["pizo-new-realty-dectruct-input"],
                style: {
                    border: "none"
                },
                props: {
                    innerHTML: fullDesc
                }
            }

        ]
    });
    if (fullAddressOld === "") {
        oldAddress.style.display = "none";
    }
    if (fullName === "") {
        name.style.display = "none";
    }
    if (fullDesc === "") {
        desc.style.display = "none";
    }
    var purpose = moduleDatabase.getModule("purpose").getList("name", "id");
    var unitMoney1 = moduleDatabase.getModule("unit_money").getList("name", "coefficient");
    unitMoney1 = [...unitMoney1];
    unitMoney1.unshift({ text: "VND", value: 1 });
    var temp = _({
        tag: "div",
        class: ["pizo-new-realty-dectruct", "pizo-only-view"],
        on: {
            scroll: function(event) {
                for (var i = this.childNodes.length - 1; i >= 0; i--) {
                    if (this.childNodes[i].offsetTop < this.scrollTop) {
                        self.buttonRange.value = i + 1;
                        return;
                    }
                }
                self.buttonRange.value = 0;
            }
        },
        child: [{
                tag: "div",
                // class:"",
                child: [{
                        tag: "div",
                        class: "pizo-new-realty-dectruct-tab",
                        props: {
                            innerHTML: "Mô tả"
                        }
                    },
                    name,
                    oldAddress,
                    desc,
                ]
            },
            {
                tag: "div",
                child: [{
                        tag: "div",
                        class: "pizo-new-realty-dectruct-tab",
                        props: {
                            innerHTML: "Thông tin xây dựng"
                        }
                    },
                    {
                        tag: "div",
                        class: "pizo-new-realty-dectruct-content",
                        child: [{
                                tag: "div",
                                class: "pizo-new-realty-dectruct-content-area",
                                child: [{
                                        tag: "span",
                                        class: "pizo-new-realty-detruct-content-area-label",
                                        props: {
                                            innerHTML: "Diện tích"
                                        },
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size",
                                        child: [{
                                                tag: "div",
                                                class: "pizo-new-realty-dectruct-content-area-size-zone",
                                                child: [{
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row",
                                                    child: [{
                                                            tag: "span",
                                                            class: "pizo-new-realty-dectruct-content-area-height-label",
                                                            props: {
                                                                innerHTML: "Ngang"
                                                            },
                                                        },
                                                        {
                                                            tag: "input",
                                                            class: ["pizo-new-realty-dectruct-content-area-height", "pizo-new-realty-dectruct-input"],
                                                            on: {
                                                                change: function(event) {
                                                                    var valueA = 0;
                                                                    var valueB = 0;
                                                                    if (this.value !== "") {
                                                                        valueA = this.value * this.nextSibling.value;
                                                                    }
                                                                    var width = $('input.pizo-new-realty-dectruct-content-area-width', temp);
                                                                    if (width.value !== "") {
                                                                        valueB = width.value * width.nextSibling.value;
                                                                    }
                                                                    var input1 = $('input.pizo-new-realty-dectruct-content-area-1', temp);
                                                                    input1.value = valueA * valueB / input1.nextSibling.value;
                                                                    var input2 = $('input.pizo-new-realty-dectruct-content-area-2', temp);
                                                                    input2.value = valueA * valueB / input2.nextSibling.value;
                                                                    var inputall = $('input.pizo-new-realty-dectruct-content-area-all', temp);
                                                                    inputall.value = valueA * valueB / input2.nextSibling.value;
                                                                    inputall.emit("change");
                                                                }
                                                            },
                                                            attr: {
                                                                type: "number",
                                                                min: 0
                                                            }
                                                        },
                                                        unitHeight
                                                    ]
                                                }]
                                            },
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-dectruct-content-area-size-zone",
                                                child: [{
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row",
                                                    child: [{
                                                            tag: "span",
                                                            class: "pizo-new-realty-dectruct-content-area-width-label",
                                                            props: {
                                                                innerHTML: "Dài"
                                                            },
                                                        },
                                                        {
                                                            tag: "input",
                                                            class: ["pizo-new-realty-dectruct-content-area-width", "pizo-new-realty-dectruct-input"],
                                                            on: {
                                                                change: function(event) {
                                                                    var valueA = 0;
                                                                    var valueB = 0;
                                                                    if (this.value !== "") {
                                                                        valueA = this.value * this.nextSibling.value;
                                                                    }
                                                                    var height = $('input.pizo-new-realty-dectruct-content-area-height', temp);
                                                                    if (height.value !== "") {
                                                                        valueB = height.value * height.nextSibling.value;
                                                                    }
                                                                    var input1 = $('input.pizo-new-realty-dectruct-content-area-1', temp);
                                                                    input1.value = valueA * valueB / input1.nextSibling.value;
                                                                    var input2 = $('input.pizo-new-realty-dectruct-content-area-2', temp);
                                                                    input2.value = valueA * valueB / input2.nextSibling.value;
                                                                    var inputall = $('input.pizo-new-realty-dectruct-content-area-all', temp);
                                                                    inputall.value = valueA * valueB / input2.nextSibling.value;
                                                                    inputall.emit("change");
                                                                }
                                                            },
                                                            attr: {
                                                                type: "number",
                                                                min: 0
                                                            }
                                                        },
                                                        unitWidth
                                                    ]
                                                }]
                                            },

                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size",
                                        child: [{
                                                tag: "div",
                                                class: "pizo-new-realty-dectruct-content-area-size-zone",
                                                child: [{
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row",
                                                    child: [{
                                                            tag: "span",
                                                            class: "pizo-new-realty-dectruct-content-area-1-label",
                                                            props: {
                                                                innerHTML: "Đất XD"
                                                            },
                                                        },
                                                        {
                                                            tag: "input",
                                                            class: ["pizo-new-realty-dectruct-content-area-1", "pizo-new-realty-dectruct-input"],
                                                            attr: {
                                                                type: "number",
                                                                min: 0
                                                            }
                                                        },
                                                        unit_Zone_1
                                                    ]
                                                }]
                                            },
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-dectruct-content-area-size-zone",
                                                child: [{
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row",
                                                    child: [{
                                                            tag: "span",
                                                            class: "pizo-new-realty-dectruct-content-area-2-label",
                                                            props: {
                                                                innerHTML: "Sàn XD"
                                                            },
                                                        },
                                                        {
                                                            tag: "input",
                                                            class: ["pizo-new-realty-dectruct-content-area-2", "pizo-new-realty-dectruct-input"],
                                                            attr: {
                                                                type: "number",
                                                                min: 0
                                                            }
                                                        },
                                                        unit_Zone_2
                                                    ]
                                                }]
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size",
                                        child: [{
                                                tag: "div",
                                                class: "pizo-new-realty-dectruct-content-area-size-zone",
                                                child: [{
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row",
                                                    child: [{
                                                            tag: "span",
                                                            class: "pizo-new-realty-dectruct-content-area-1-label",
                                                            props: {
                                                                innerHTML: "Diện tích"
                                                            },
                                                        },
                                                        {
                                                            tag: "input",
                                                            class: ["pizo-new-realty-dectruct-content-area-all", "pizo-new-realty-dectruct-input"],
                                                            on: {
                                                                change: function(event) {
                                                                    var inputValue = $("input.pizo-new-realty-detruct-content-price-per", temp);
                                                                    var price = $('input.pizo-new-realty-detruct-content-price', temp);
                                                                    var priceUnit = $('div.pizo-new-realty-detruct-content-price-unit', temp);

                                                                    var areaValue = $('input.pizo-new-realty-dectruct-content-area-all', temp);
                                                                    var areaValueUnit = unit_Zone_all;
                                                                    inputValue.value = price.value * priceUnit.value / (areaValue.value * areaValueUnit.value) * 1000;
                                                                }
                                                            },
                                                            attr: {
                                                                type: "number",
                                                                min: 0
                                                            }
                                                        },
                                                        unit_Zone_all
                                                    ]
                                                }]
                                            },
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-dectruct-content-area-size-zone",
                                                child: [{
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row",
                                                    child: [{
                                                            tag: "span",
                                                            class: "pizo-new-realty-dectruct-content-area-2-label",
                                                            props: {
                                                                innerHTML: "Kết cấu"
                                                            },
                                                        },
                                                        {
                                                            tag: "selectmenu",
                                                            class: "pizo-new-realty-detruct-content-structure",
                                                            on: {
                                                                change: function(event) {
                                                                    if (this.value === 3)
                                                                        advanceDetruct.style.display = "";
                                                                    else
                                                                        advanceDetruct.style.display = "none";
                                                                    if (this.value >= 2)
                                                                        simpleDetruct.style.display = "";
                                                                    else
                                                                        simpleDetruct.style.display = "none";
                                                                }
                                                            },
                                                            props: {
                                                                items: [
                                                                    { text: "Chưa xác định", value: 0 },
                                                                    { text: "Đất trống", value: 1 },
                                                                    { text: "Cấp 4", value: 2 },
                                                                    { text: "Sẳn *", value: 3 },
                                                                ]
                                                            }
                                                        }
                                                    ]
                                                }]
                                            }
                                        ]
                                    },

                                ]
                            },
                            {
                                tag: "div",
                                class: ["pizo-new-realty-dectruct-content-area", "pizo-new-realty-dectruct-content-area-simple"],
                                child: [{
                                        tag: "span",
                                        class: "pizo-new-realty-detruct-content-area-label",
                                        style: {
                                            marginBottom: "0.7143rem"
                                        },
                                        props: {
                                            innerHTML: "Quy mô kết cấu"
                                        },
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-advance",
                                        child: [{
                                                tag: "div",
                                                class: ["pizo-new-realty-dectruct-content-area-size", ],
                                                child: [{
                                                        tag: "div",
                                                        class: ["pizo-new-realty-dectruct-content-area-size-zone"],
                                                        child: [{
                                                            tag: "div",
                                                            class: "pizo-new-realty-desc-detail-row",
                                                            child: [{
                                                                    tag: "span",
                                                                    class: "pizo-new-realty-dectruct-content-area-floor-label",
                                                                    props: {
                                                                        innerHTML: "Tầng"
                                                                    },
                                                                },
                                                                {
                                                                    tag: "input",
                                                                    class: ["pizo-new-realty-dectruct-content-area-floor", "pizo-new-realty-dectruct-input"],
                                                                    attr: {
                                                                        type: "number",
                                                                        min: 0,
                                                                        step: 1
                                                                    },
                                                                    props: {
                                                                        value: 0
                                                                    }
                                                                }
                                                            ]
                                                        }]
                                                    },
                                                    {
                                                        tag: "div",
                                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                                        child: [{
                                                            tag: "div",
                                                            class: "pizo-new-realty-desc-detail-row",
                                                            child: [{
                                                                    tag: "span",
                                                                    class: "pizo-new-realty-dectruct-content-area-basement-label",
                                                                    props: {
                                                                        innerHTML: "Hầm"
                                                                    },
                                                                },
                                                                {
                                                                    tag: "input",
                                                                    class: ["pizo-new-realty-dectruct-content-area-basement", "pizo-new-realty-dectruct-input"],
                                                                    attr: {
                                                                        type: "number",
                                                                        min: 0,
                                                                        step: 1
                                                                    },
                                                                    props: {
                                                                        value: 0
                                                                    }
                                                                }
                                                            ]
                                                        }]
                                                    },

                                                ]
                                            },
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-dectruct-content-area-selectbox",
                                                child: [{
                                                        tag: "div",
                                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                                        child: [{
                                                            tag: "div",
                                                            class: "pizo-new-realty-desc-detail-row",
                                                            child: [{
                                                                    tag: "div",
                                                                    class: "pizo-new-realty-dectruct-content-area-selectbox-child",
                                                                    child: [{
                                                                            tag: "span",
                                                                            props: {
                                                                                innerHTML: "Lửng"
                                                                            }
                                                                        },
                                                                        {
                                                                            tag: "checkbox",
                                                                            class: "pizo-new-realty-dectruct-content-area-selectbox-child-1"
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    tag: "div",
                                                                    class: "pizo-new-realty-dectruct-content-area-selectbox-child",
                                                                    child: [{
                                                                            tag: "span",
                                                                            props: {
                                                                                innerHTML: "Sân thượng"
                                                                            }
                                                                        },
                                                                        {
                                                                            tag: "checkbox",
                                                                            class: "pizo-new-realty-dectruct-content-area-selectbox-child-2"
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }]
                                                    },
                                                    {
                                                        tag: "div",
                                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                                        child: [{
                                                            tag: "div",
                                                            class: "pizo-new-realty-desc-detail-row",
                                                            child: [{
                                                                    tag: "div",
                                                                    class: "pizo-new-realty-dectruct-content-area-selectbox-child",
                                                                    child: [{
                                                                            tag: "span",
                                                                            props: {
                                                                                innerHTML: "Ban công"
                                                                            }
                                                                        },
                                                                        {
                                                                            tag: "checkbox",
                                                                            class: "pizo-new-realty-dectruct-content-area-selectbox-child-3"
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    tag: "div",
                                                                    class: "pizo-new-realty-dectruct-content-area-selectbox-child",
                                                                    child: [{
                                                                            tag: "span",
                                                                            props: {
                                                                                innerHTML: "Thang máy"
                                                                            }
                                                                        },
                                                                        {
                                                                            tag: "checkbox",
                                                                            class: "pizo-new-realty-dectruct-content-area-selectbox-child-4"
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }]
                                                    },
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size",
                                        child: [{
                                                tag: "div",
                                                class: "pizo-new-realty-dectruct-content-area-size-zone",
                                                child: [{
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row",
                                                    child: [{
                                                            tag: "span",
                                                            class: "pizo-new-realty-dectruct-content-area-bedroom-label",
                                                            props: {
                                                                innerHTML: "Phòng ngủ"
                                                            },
                                                        },
                                                        {
                                                            tag: "input",
                                                            class: ["pizo-new-realty-dectruct-content-area-bedroom", "pizo-new-realty-dectruct-input"],
                                                            attr: {
                                                                type: "number",
                                                                min: 0,
                                                                step: 1
                                                            },
                                                            props: {
                                                                value: 0
                                                            }
                                                        }
                                                    ]
                                                }]
                                            },
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-dectruct-content-area-size-zone",
                                                child: [{
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row",
                                                    child: [{
                                                            tag: "span",
                                                            class: "pizo-new-realty-dectruct-content-area-living-label",
                                                            props: {
                                                                innerHTML: "Phòng khách"
                                                            },
                                                        },
                                                        {
                                                            tag: "input",
                                                            class: ["pizo-new-realty-dectruct-content-area-living", "pizo-new-realty-dectruct-input"],
                                                            attr: {
                                                                type: "number",
                                                                min: 0,
                                                                step: 1
                                                            },
                                                            props: {
                                                                value: 0
                                                            }
                                                        }
                                                    ]
                                                }]
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size",
                                        child: [{
                                                tag: "div",
                                                class: "pizo-new-realty-dectruct-content-area-size-zone",
                                                child: [{
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row",
                                                    child: [{
                                                            tag: "span",
                                                            class: "pizo-new-realty-dectruct-content-area-kitchen-label",
                                                            props: {
                                                                innerHTML: "Bếp"
                                                            },
                                                        },
                                                        {
                                                            tag: "input",
                                                            class: ["pizo-new-realty-dectruct-content-area-kitchen", "pizo-new-realty-dectruct-input"],
                                                            attr: {
                                                                type: "number",
                                                                min: 0,
                                                                step: 1
                                                            },
                                                            props: {
                                                                value: 0
                                                            }
                                                        }
                                                    ]
                                                }]
                                            },
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-dectruct-content-area-size-zone",
                                                child: [{
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row",
                                                    child: [{
                                                            tag: "span",
                                                            class: "pizo-new-realty-dectruct-content-area-toilet-label",
                                                            props: {
                                                                innerHTML: "Toilet"
                                                            },
                                                        },
                                                        {
                                                            tag: "input",
                                                            class: ["pizo-new-realty-dectruct-content-area-toilet", "pizo-new-realty-dectruct-input"],
                                                            attr: {
                                                                type: "number",
                                                                min: 0,
                                                                step: 1
                                                            },
                                                            props: {
                                                                value: 0
                                                            }
                                                        }
                                                    ]
                                                }]
                                            }
                                        ]
                                    },

                                ]
                            },
                            {
                                tag: "div",
                                class: "pizo-new-realty-dectruct-content-area",
                                child: [{
                                        tag: "div",
                                        class: ["pizo-new-realty-dectruct-content-area-size-zone", "no-margin-style"],
                                        child: [{
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row",
                                            child: [{
                                                    tag: "span",
                                                    class: "pizo-new-realty-detruct-content-area-label",
                                                    props: {
                                                        innerHTML: "Hướng"
                                                    },
                                                },
                                                {
                                                    tag: "selectmenu",
                                                    class: "pizo-new-realty-detruct-content-direction",
                                                    props: {
                                                        items: [
                                                            { text: "Chưa xác định", value: 0 },
                                                            { text: "Đông", value: 1 },
                                                            { text: "Tây", value: 2 },
                                                            { text: "Nam", value: 3 },
                                                            { text: "Bắc", value: 4 },
                                                            { text: "Tây Bắc", value: 5 },
                                                            { text: "Đông Bắc", value: 6 },
                                                            { text: "Tây Nam", value: 7 },
                                                            { text: "Đông Nam", value: 8 },
                                                        ]
                                                    }
                                                },
                                            ]
                                        }]
                                    },
                                    {
                                        tag: "div",
                                        class: ["pizo-new-realty-dectruct-content-area-size-zone", "margin-style"],
                                        child: [{
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row",
                                            child: [{
                                                    tag: "span",
                                                    class: "pizo-new-realty-detruct-content-area-label",
                                                    props: {
                                                        innerHTML: "Loại nhà"
                                                    },
                                                },
                                                {
                                                    tag: "selectmenu",
                                                    class: "pizo-new-realty-detruct-content-type",
                                                    props: {
                                                        items: moduleDatabase.getModule("type_activehouses").getList("name", "id")
                                                    }
                                                },
                                            ]
                                        }]
                                    }
                                ]
                            },
                            {
                                tag: "div",
                                class: "pizo-new-realty-dectruct-content-area-right",
                                child: [{
                                        tag: "span",
                                        class: "pizo-new-realty-detruct-content-area-label",
                                        props: {
                                            innerHTML: "Chiều rộng đường vào"
                                        },
                                    },
                                    {
                                        tag: "input",
                                        class: ["pizo-new-realty-dectruct-content-area-access", "pizo-new-realty-dectruct-input"],
                                        attr: {
                                            type: "number",
                                            min: 0,
                                            step: 1
                                        },
                                        props: {
                                            value: 0
                                        }
                                    },
                                    unitWidthRoad
                                ]
                            },
                        ]
                    },
                ]
            },
            {
                tag: "div",
                child: [{
                        tag: "div",
                        class: "pizo-new-realty-dectruct-tab",
                        props: {
                            innerHTML: "Giá"
                        }
                    },
                    {
                        tag: "div",
                        class: "pizo-new-realty-dectruct-content",
                        child: [{
                                tag: "div",
                                class: "pizo-new-realty-dectruct-content-area",
                                child: [{
                                        tag: "div",
                                        class: ["pizo-new-realty-dectruct-content-area-size-zone", "no-margin-style"],
                                        child: [{
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row",
                                            child: [{
                                                    tag: "span",
                                                    class: "pizo-new-realty-detruct-content-area-label",
                                                    props: {
                                                        innerHTML: "Giá"
                                                    },
                                                },
                                                {
                                                    tag: "input",
                                                    class: ["pizo-new-realty-detruct-content-price", "pizo-new-realty-dectruct-input"],
                                                    props: {
                                                        value: 0
                                                    },
                                                    on: {
                                                        change: function(event) {
                                                            var inputValue = $("input.pizo-new-realty-detruct-content-price-per", temp);
                                                            var price = $('input.pizo-new-realty-detruct-content-price', temp);
                                                            var priceUnit = $('div.pizo-new-realty-detruct-content-price-unit', temp)

                                                            var areaValue = $('input.pizo-new-realty-dectruct-content-area-all', temp);
                                                            var areaValueUnit = unit_Zone_all;
                                                            inputValue.value = price.value * priceUnit.value / (areaValue.value * areaValueUnit.value) * 1000;
                                                        }
                                                    }
                                                },
                                                {
                                                    tag: "selectmenu",
                                                    class: "pizo-new-realty-detruct-content-price-unit",
                                                    on: {
                                                        change: function(event) {
                                                            var price = $('input.pizo-new-realty-detruct-content-price', temp);
                                                            price.value = price.value * event.lastValue / event.value;
                                                        }
                                                    },
                                                    props: {
                                                        value: 1,
                                                        items: unitMoney1
                                                    }
                                                }
                                            ]
                                        }]
                                    },
                                    {
                                        tag: "div",
                                        class: ["pizo-new-realty-dectruct-content-area-size-zone", "margin-style"],
                                        child: [{
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row",
                                            child: [{
                                                    tag: "span",
                                                    class: "pizo-new-realty-detruct-content-area-label",
                                                    props: {
                                                        innerHTML: "Giá m²"
                                                    },
                                                },
                                                {
                                                    tag: "input",
                                                    class: ["pizo-new-realty-detruct-content-price-per", "pizo-new-realty-dectruct-input"],
                                                    attr: {
                                                        disabled: ""
                                                    }
                                                }
                                            ]
                                        }]
                                    }
                                ]
                            },
                            priceRent,
                            {
                                tag: "div",
                                class: "pizo-new-realty-dectruct-content-area-right",
                                child: [{
                                        tag: "span",
                                        class: "pizo-new-realty-detruct-content-area-label",
                                        props: {
                                            innerHTML: "Phù hợp khai thác"
                                        },
                                    },
                                    {
                                        tag: "selectbox",
                                        class: ["pizo-new-realty-dectruct-content-area-fit", "pizo-new-realty-dectruct-input"],
                                        props: {
                                            items: purpose
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                ]
            },
            this.convenientView(data),
            this.contactView(data),
            this.juridicalView(data),
            {
                tag: "div",
                class: "pizo-new-realty-dectruct-tab-ownership-history",
                child: [{
                        tag: "div",
                        class: "pizo-new-realty-dectruct-tab",
                        props: {
                            innerHTML: "Tiến trình lịch sử"
                        },
                    },
                    this.possessionHistory(data)
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-dectruct-tab-historical-progress",
                child: [{
                    tag: "div",
                    class: "pizo-new-realty-dectruct-tab",
                    props: {
                        innerHTML: "Lịch sử sở hữu"
                    }
                }, ],
                on: {
                    click: function() {

                    }
                }
            },
        ]
    })

    var inputHeight = $('input.pizo-new-realty-dectruct-content-area-height.pizo-new-realty-dectruct-input', temp);
    var inputWidth = $('input.pizo-new-realty-dectruct-content-area-width.pizo-new-realty-dectruct-input', temp);
    var inputUnitHeight = unitHeight;
    var inputUnitWidth = unitWidth;
    var inputZone1 = $('input.pizo-new-realty-dectruct-content-area-1.pizo-new-realty-dectruct-input', temp);
    var inputZone2 = $('input.pizo-new-realty-dectruct-content-area-2.pizo-new-realty-dectruct-input', temp);
    var inputUnitZone1 = unit_Zone_1;
    var inputUnitZone2 = unit_Zone_2;
    var inputZoneAll = $('input.pizo-new-realty-dectruct-content-area-all', temp);
    var inputUnitZoneAll = unit_Zone_all;
    var inputPrice = $('input.pizo-new-realty-detruct-content-price', temp);
    var inputUnitPrice = $('div.pizo-new-realty-detruct-content-price-unit', temp);
    var inputPriceRent = $('input.pizo-new-realty-detruct-content-price-rent', temp);
    var inputPriceRentUnit = $('div.pizo-new-realty-detruct-content-price-rent-unit', temp);
    var inputFit = $('div.pizo-new-realty-dectruct-content-area-fit', temp);
    var direction = $('div.pizo-new-realty-detruct-content-direction', temp);
    var structure = $('div.pizo-new-realty-detruct-content-structure', temp);
    var type = $('div.pizo-new-realty-detruct-content-type', temp);
    var inputWidthRoad = $('input.pizo-new-realty-dectruct-content-area-access', temp);
    var inputUnitWidthRoad = unitWidthRoad;
    var inputBedroom = $('input.pizo-new-realty-dectruct-content-area-bedroom', temp);
    var inputKitchen = $('input.pizo-new-realty-dectruct-content-area-kitchen', temp);
    var inputToilet = $('input.pizo-new-realty-dectruct-content-area-toilet', temp);
    var inputLiving = $('input.pizo-new-realty-dectruct-content-area-living', temp);
    var inputBasement = $('input.pizo-new-realty-dectruct-content-area-basement', temp);
    var inputFloor = $('input.pizo-new-realty-dectruct-content-area-floor', temp);

    var advanceDetruct = $("div.pizo-new-realty-dectruct-content-area-advance", temp);
    var simpleDetruct = $("div.pizo-new-realty-dectruct-content-area-simple", temp);

    var advanceDetruct1 = $("div.pizo-new-realty-dectruct-content-area-selectbox-child-1", temp);
    var advanceDetruct2 = $("div.pizo-new-realty-dectruct-content-area-selectbox-child-2", temp);
    var advanceDetruct3 = $("div.pizo-new-realty-dectruct-content-area-selectbox-child-3", temp);
    var advanceDetruct4 = $("div.pizo-new-realty-dectruct-content-area-selectbox-child-4", temp);
    var historical = $('span.pizo-new-realty-dectruct-tab-historical-progress-label', temp);

    if (data !== undefined) {
        var original = data;
        inputHeight.value = original.height;
        inputWidth.value = original.width;
        inputZone1.value = original.landarea;
        inputZone2.value = original.floorarea;
        inputZoneAll.value = original.acreage;
        direction.value = original.direction;
        type.value = original.type;
        inputFit.value = original.fit;
        inputWidthRoad.value = original.roadwidth;
        inputFloor.value = original.floor;
        inputBasement.value = original.basement;
        inputBedroom.value = original.bedroom;
        inputLiving.value = original.living;
        inputToilet.value = original.toilet;
        inputKitchen.value = original.kitchen;
        inputPrice.value = original.price;
        inputPriceRent.value = original.pricerent;


        var min = Infinity;
        var unitMin = 1;
        for (var i = 0; i < unitMoney.length; i++) {
            var tempValue = original.price / unitMoney[i].value;
            if (tempValue > 1 && min > tempValue) {
                min = tempValue;
                unitMin = unitMoney[i].value;
            }
        }
        inputUnitPrice.value = unitMin;
        inputPrice.value = original.price / unitMin;
        var min = Infinity;
        var unitMin = 1;
        for (var i = 0; i < unitMoney1.length; i++) {
            var tempValue = original.pricerent / unitMoney1[i].value;
            if (tempValue > 1 && min > tempValue) {
                min = tempValue;
                unitMin = unitMoney1[i].value;
            }
        }
        inputPriceRentUnit.value = unitMin;
        inputPriceRent.value = original.pricerent / unitMin;
        inputPrice.emit("change");
        // structure.value = original.structure;
        // structure.emit("change");
        // inputFit.values = formatFit(parseInt(original.fit));
        // inputPrice.emit("change");
        // var advanceDetruct = original.advancedetruct;
        // advanceDetruct1.checked = advanceDetruct % 10 ? true : false;
        // advanceDetruct = parseInt(advanceDetruct / 10);
        // advanceDetruct2.checked = advanceDetruct % 10 ? true : false;
        // advanceDetruct = parseInt(advanceDetruct / 10);
        // advanceDetruct3.checked = advanceDetruct % 10 ? true : false;
        // advanceDetruct = parseInt(advanceDetruct / 10);
        // advanceDetruct4.checked = advanceDetruct % 10 == 1 ? true : false;
        // moduleDatabase.getModule("activehouses_logs").load({
        //     WHERE: [{ houseid: original.id }],
        //     ORDERING: "created"
        // }).then(function(value) {
        //     var text = "";
        //     for (var i = value.length - 1; i >= 0; i--) {
        //         text += value[i].log;
        //         text += "</br>"
        //     }
        //     historical.innerHTML = text;
        //     if (text != "")
        //         historical.parentNode.style.margin = "10px";
        // })
    }
    return temp;
}

// MapRealty.prototype

MapRealty.prototype.possessionHistory = function(data) {
    var container = _({
        tag: "ul",
        class: "tl"
    })
    var temp = _({
        tag: "div",
        class: "history-tl-container",
        child: [
            container
        ]
    })
    var promiseAll = [];
    var promise2 = moduleDatabase.getModule("users").load();
    promiseAll.push(promise2);
    var promise3 = moduleDatabase.getModule("contact_link").load({ WHERE: [{ houseid: data.id }], ORDERING: "created" });
    promiseAll.push(promise3);
    var promiseTemp = [];
    Promise.all(promiseAll).then(function(current) {
        current = current[1];
        if (current && current.length > 0)
            current = current[0];
        var promise5 = moduleDatabase.getModule("contacts").load({ WHERE: [{ id: current.contactid }] });
        promiseTemp.push(promise5)
        promise5.then(function(tempValue) {
                var varTemp = this.possessionHistoryNode(tempValue);
                if (varTemp)
                    container.appendChild(varTemp);
            }.bind(this, current))
            // var varTemp = this.possessionHistoryNode(current);
            // if (varTemp)
            //     container.appendChild(varTemp);
        var promise4 = moduleDatabase.getModule("possession_history").load({ WHERE: [{ houseid: data.id }] });
        promise4.then(function(values) {
            for (var i = 0; i < values.length; i++) {
                if (values[i].contactid != 0) {
                    var promise6 = moduleDatabase.getModule("contacts").load({ WHERE: [{ id: values[i].contactid }] });
                    promiseTemp.push(promise6)
                    promise6.then(function(tempValue) {
                        var varTemp = this.possessionHistoryNode(tempValue);
                        if (varTemp)
                            container.appendChild(varTemp);
                    }.bind(this, value[i]))
                } else {
                    var varTemp = this.possessionHistoryNode(values[i]);
                    if (varTemp)
                        container.appendChild(varTemp);
                }
            }
            Promise.all(promiseTemp).then(function() {
                // if (container.childNodes.length <= 1)
                //     container.style.display = "none";
            })
        }.bind(this))
    }.bind(this))
    return temp;
}

MapRealty.prototype.possessionHistoryNode = function(data) {
    var checkUser = moduleDatabase.getModule("users").getLibary("id");
    var checkContact = moduleDatabase.getModule("contacts").getLibary("id");
    var name = "",
        phone = "",
        status = "Tình trạng: ",
        ownership = "Quan hệ sở hữu: "
    if (data.userid != 0) {
        var user = checkUser[data.userid];
        if (user) {
            name = user.name;
            phone = user.phone;
            status += "còn hoạt động";
            switch (eval(data.typecontact)) {
                case 0:
                    ownership += "Chưa xác định"
                    break;
                case 1:
                    ownership += "Môi giới"
                    break;
                case 2:
                    ownership += "Chủ nhà"
                    break;
                case 3:
                    ownership += "Họ hàng"
                    break;

            }
        }
    } else
    if (data.contactid != 0) {
        var user = checkContact[data.contactid];
        if (user) {
            name = user.name;
            phone = user.phone;
            switch (eval(user.statusphone)) {
                case 0:
                    status += "còn hoạt động"
                    break;
                case 1:
                    status += "sai số"
                    break;
                case 2:
                    status += "gọi lại sau"
                    break;
                case 3:
                    status += "bỏ qua"
                    break;
                case 4:
                    status += "khóa máy"
                    break;

            }
            switch (eval(data.typecontact)) {
                case 0:
                    ownership += "Chưa xác định"
                    break;
                case 1:
                    ownership += "Môi giới"
                    break;
                case 2:
                    ownership += "Chủ nhà"
                    break;
                case 3:
                    ownership += "Họ hàng"
                    break;
            }
        }
    }
    var temp = _({
        tag: "li",
        class: "tl-item",
        atr: {
            ngRepeat: "item in retailer_history"
        },
        child: [{
                tag: "div",
                class: "timestamp",
                props: {
                    innerHTML: formatDate(data.created, false, false, true, true, true) + "<br>" + formatDate(data.created, true, true, false, false, false)
                }
            },
            {
                tag: "div",
                class: "item-title",
                props: {
                    innerHTML: name + " ( " + phone + " )"
                }
            },
            {
                tag: "div",
                class: "item-detail",
                props: {
                    innerHTML: ownership + "<br>" + status + "<br>" + data.note
                }
            }
        ]
    })
    if (!user)
        return undefined;
    return temp;
}

MapRealty.prototype.noteChat = function(data) {
    var userData = this.checkUserID[data.userid];
    var temp = _({
        tag: "p",
        child: [{
                tag: "strong",
                props: {
                    innerHTML: userData.name
                }
            },
            {
                tag: "small",
                props: {
                    innerHTML: " MS( " + userData.id + " )"
                }
            },
            {
                tag: "small",
                props: {
                    innerHTML: "    "
                }
            },
            {
                tag: "span",
                class: ["oi", "oi-timer"],
                props: {
                    innerHTML: formatDate(data.created, true, true, true, true, true)
                }
            },
            {
                tag: "br"
            },
            {
                tag: "span",
                props: {
                    innerHTML: data.content
                }
            }
        ]
    })
    return temp;
}

MapRealty.prototype.itemMap = function(marker) {
    var self = this;
    var data = marker.data;

    var thumnail = _({
        tag: "img"
    });
    var type;
    var diffTime = Math.abs(new Date() - new Date(data.created));
    var date = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    type = this.checkTypeHouse[parseInt(data.type)];
    if (type !== undefined)
        type = type.name;
    var fullAddress = "";
    if (data.addressnumber != "" || data.portion != "") {
        var number = data.addressnumber;
        var ward = "",
            district = "",
            state = "";
        if (this.checkStreet[data.streetid])
            var street = this.checkStreet[data.streetid].name;
        else
            var street = "";
        if (data.wardid) {
            var ward = this.checkWard[data.wardid].name;
            var district = this.checkDistrict[this.checkWard[data.wardid].districtid].name;
            var state = this.checkState[this.checkDistrict[this.checkWard[data.wardid].districtid].stateid].name;
        }
        fullAddress = number + " " + street + ", " + ward + ", " + district + ", " + state;
    }

    var statusIcon = _({
        tag: "i",
        class: ["material-icons", "list-card-type-icon", "zsg-icon-for-sale"],
        props: {
            innerHTML: "brightness_1"
        }
    });

    switch (parseInt(data.status)) {
        case 0:
            statusIcon.style.color = "yellow"
            break;
        case 1:
            statusIcon.style.color = "red"
            break;
        case 10:
            statusIcon.style.color = "blue"
            break;
        case 11:
            statusIcon.style.color = "purple"
            break;
    }
    var priceContent = _({
        tag: "div",
        class: "list-card-price",
        props: {
            innerHTML: "VND " + (data.price / 1000000000) + " tỉ"
        }
    })
    var temp = _({
        tag: "div",
        on: {
            mouseover: function(event) {
                if (marker.getMap() == null) {
                    marker.setMap(self.mapView.map);
                    marker.tempMap = true;
                }
                google.maps.event.trigger(marker, 'mouseover');
            },
            mouseout: function(event) {
                if (marker.tempMap == true) {
                    marker.setMap(null);
                    marker.tempMap = false;
                }
                google.maps.event.trigger(marker, 'mouseout');
            },
            click: function(event) {
                document.body.appendChild(self.modalLargeRealty(data));
            }
        },
        child: [{
                tag: "scrpit",
                props: {
                    type: "application/ld+json",
                    // innerHTML:"" Thêm scrpit cần để làm từ khóa cho google search
                }
            },
            {
                tag: "article",
                class: ["list-card", "list-card-short", "list-card_not-saved"],
                child: [{
                        tag: "div",
                        class: "list-card-info",
                        child: [{
                                tag: "a",
                                class: "list-card-link",
                                props: {
                                    src: "Link nhà"
                                },
                                child: [{
                                    tag: "address",
                                    class: "list-card-addr",
                                    props: {
                                        innerHTML: fullAddress
                                    }
                                }]
                            },
                            {
                                tag: "div",
                                class: "list-card-footer",
                                child: [{
                                    tag: "div",
                                    class: "list-card-type",
                                    child: [
                                        statusIcon,
                                        {
                                            tag: "span",
                                            props: {
                                                innerHTML: type
                                            }
                                        }
                                    ]
                                }]
                            },
                            {
                                tag: "div",
                                class: "list-card-heading",
                                child: [priceContent,
                                    {
                                        tag: "ul",
                                        class: "list-card-details",
                                        child: [{
                                                tag: "li",
                                                child: [{
                                                        tag: "span",
                                                        props: {
                                                            innerHTML: data.width
                                                        }
                                                    },
                                                    {
                                                        tag: "abbr",
                                                        class: "list-card-label",
                                                        props: {
                                                            innerHTML: "m"
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                text: "x"
                                            },
                                            {
                                                tag: "li",
                                                child: [{
                                                        tag: "span",
                                                        props: {
                                                            innerHTML: data.height
                                                        }
                                                    },
                                                    {
                                                        tag: "abbr",
                                                        class: "list-card-label",
                                                        props: {
                                                            innerHTML: "m"
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                tag: "li",
                                                child: [{
                                                        tag: "span",
                                                        props: {
                                                            innerHTML: data.acreage
                                                        }
                                                    },
                                                    {
                                                        tag: "abbr",
                                                        class: "list-card-label",
                                                        props: {
                                                            innerHTML: "m²"
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag: "div",
                        class: "list-card-top",
                        child: [{
                                tag: "div",
                                class: ["list-card-variable-text", "list-card-img-overlay"],
                                props: {
                                    innerHTML: date + " ngày trước"
                                }
                            },
                            {
                                tag: "div",
                                class: ["list-card-brokerage", "list-card-img-overlay"],
                                child: [{
                                    tag: "div",
                                    class: "list-card-truncate",
                                    props: {
                                        innerHTML: data.content
                                    }
                                }]
                            },
                            {
                                tag: "a",
                                class: ["list-card-link", "list-card-img"],
                                props: {
                                    src: "Link nhà"
                                },
                                child: [
                                    thumnail
                                ]
                            }
                        ]
                    },
                    {
                        tag: "button",
                        class: "list-card-save",
                        on: {
                            click: function(event) {
                                event.stopPropagation();
                                if (this.check) {
                                    this.check = undefined;
                                    this.childNodes[0].innerHTML = "favorite_border";
                                    var loading = new loadingWheel();
                                    moduleDatabase.getModule("favourite").delete({ userid: window.userid, houseid: data.id }).then(function() {
                                        loading.disable();
                                        moduleDatabase.getModule("activehouses").load().then(function(value) {
                                            if (moduleDatabase.stackUpdateFavourite) {
                                                for (var i = 0; i < moduleDatabase.stackUpdateFavourite.length; i++) {
                                                    moduleDatabase.stackUpdateFavourite[i].mTable.updateTable(undefined, moduleDatabase.stackUpdateFavourite[i].formatDataRow(value));
                                                }
                                            }
                                        })
                                    });
                                } else {
                                    this.check = true;
                                    this.childNodes[0].innerHTML = "favorite";
                                    var loading = new loadingWheel();
                                    moduleDatabase.getModule("favourite").add({ userid: window.userid, houseid: data.id }).then(function() {
                                        loading.disable();
                                        moduleDatabase.getModule("activehouses").load().then(function(value) {
                                            if (moduleDatabase.stackUpdateFavourite) {
                                                for (var i = 0; i < moduleDatabase.stackUpdateFavourite.length; i++) {
                                                    moduleDatabase.stackUpdateFavourite[i].mTable.updateTable(undefined, moduleDatabase.stackUpdateFavourite[i].formatDataRow(value));
                                                }
                                            }
                                        })
                                    });
                                }
                            }
                        },
                        child: [{
                            tag: "i",
                            class: ["favorite_border", "material-icons"],
                            props: {
                                innerHTML: "favorite_border"
                            }
                        }]
                    }
                ]
            }
        ]
    })
    var checkButton = $('.list-card-save', temp);
    var checkHouseId = moduleDatabase.getModule("favourite").getLibary("houseid");
    if (checkHouseId[data.id]) {
        checkButton.childNodes[0].innerHTML = "favorite";
        checkButton.check = true;
    }
    var src = moduleDatabase.imageThumnail;
    if (data !== undefined) {
        moduleDatabase.getModule("image").load({ WHERE: [{ houseid: data.id }] }).then(function(values) {
            for (var i = 0; i < values.length; i++) {
                if (src == moduleDatabase.imageThumnail && values[i].type == 1) {
                    src = moduleDatabase.imageAssetSrc + values[i].src;
                }
                if (values[i].thumnail == 1) {
                    src = moduleDatabase.imageAssetSrc + values[i].src;
                    break;
                }

            }
            thumnail.setAttribute("src", src);
        })
    }
    thumnail.setAttribute("src", src);
    var listener = google.maps.event.addListener(marker, 'click', function(event) {
            temp.click();
        })
        // setTimeout(function() {
        //     onRemove(temp, function() {
        //         google.maps.event.removeListener(listener);
        //     })
        // }, 50)
    temp.setPrice = function(price) {
        priceContent.innerHTML = "VND " + price;
    }
    return temp;
}

function onRemove(element, callback) {
    const parent = element.parentNode;
    if (!parent) throw new Error("The node must already be attached");

    const obs = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const el of mutation.removedNodes) {
                if (el === element) {
                    obs.disconnect();
                    callback();
                }
            }
        }
    });
    obs.observe(parent, {
        childList: true,
    });
}

MapRealty.prototype.searchControlContent = function() {
    var startDay, endDay;
    var self = this;
    this.stackQuery = {};
    var selectStatus = _({
        tag: "selectmenu",
        on: {
            change: function() {
                var x = JSON.parse(this.value);
                var query;
                if (Array.isArray(x)) {
                    if (x.length == 2)
                        query = ["(", { status: x[0] }, "||", { status: x[1] }, ")"];
                    else
                        query = ["(", { status: x[0] }, "||", { status: x[1] }, "||", { status: x[2] }, "||", { status: x[3] }, ")"];
                } else if (this.value == -1) {
                    query = [];
                } else
                    query = [{ status: x }];
                if (this.value == "[10,11]") {
                    self.mapView.setLabelContent(false);
                } else if (this.value == "[1,11,21,31]" || this.value == "0") {
                    self.mapView.setLabelContent(true);
                }
                var queryAll = isQueryMap(self.stackQuery, query, "isStatus");
                self.mapView.setGeneralOperator(queryAll);

            }
        },
        props: {
            value: "[1,11,21,31]",
            items: [
                // {
                //     text: "Tất cả",
                //     value: "[1,10,11]"
                // },
                {
                    text: "Còn bán",
                    value: "[1,11,21,31]"
                },
                {
                    text: "Còn cho thuê",
                    value: "[11,10]"
                },
                {
                    text: "Ngừng giao dịch",
                    value: "0"
                }
            ]
        }
    })

    var oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() - 1);
    startDay = _({
        tag: 'calendar-input',
        data: {
            anchor: 'top',
            value: oneMonthFromNow,
            maxDateLimit: new Date()
        },
        on: {
            changed: function() {
                var date = this.value;
                endDay.minDateLimit = date;
                var tempDate = new Date(date.getTime());;;
                tempDate.setMonth(tempDate.getMonth() + 2);
                if (endDay.value - tempDate > 0)
                    endDay.value = tempDate;
                var query = [{ created: { operator: ">=", value: new Date(self.startDay.value.toDateString()) } }, "&&", { created: { operator: "<=", value: new Date(self.endDay.value.toDateString()) } }];
                var queryAll = isQueryMap(self.stackQuery, query, "isTimeCreate");
                self.mapView.setGeneralOperator(queryAll);
            }
        }
    })

    endDay = _({
        tag: 'calendar-input',
        data: {
            anchor: 'top',
            value: new Date(),
            minDateLimit: new Date()
        },
        on: {
            changed: function() {
                var date = this.value;
                startDay.maxDateLimit = date;
                var tempDate = new Date(date.getTime());;
                tempDate.setMonth(tempDate.getMonth() - 2);
                if (startDay.value - tempDate > 0)
                    startDay.value = tempDate;
                var query = [{ created: { operator: ">=", value: new Date(self.startDay.value.toDateString()) } }, "&&", { created: { operator: "<=", value: new Date(self.endDay.value.toDateString()) } }];
                var queryAll = isQueryMap(self.stackQuery, query, "isTimeCreate");
                self.mapView.setGeneralOperator(queryAll);
            }
        }
    })
    var query = [{ created: { operator: ">=", value: new Date(startDay.value.toDateString()) } }, "&&", { created: { operator: "<=", value: new Date(endDay.value.toDateString()) } }];
    var queryAll = isQueryMap(self.stackQuery, query, "isTimeCreate");
    var content = _({
        tag: "div",
        class: "pizo-list-realty-main-search-control-container",
        on: {
            click: function(event) {
                event.stopPropagation();
            }
        },
        child: [{
            tag: "div",
            class: "pizo-list-realty-main-search-control-container-scroller",
            child: [{
                tag: "div",
                class: "pizo-list-realty-main-search-control-row",
                child: [{
                        tag: "div",
                        class: "pizo-list-realty-main-search-control-row-price",
                        child: [{
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-HT",
                            child: [{
                                    tag: "span",
                                    class: "pizo-list-realty-main-search-control-row-HT-label",
                                    props: {
                                        innerHTML: "Tình trạng"
                                    }
                                },
                                {
                                    tag: "div",
                                    class: "pizo-list-realty-main-search-control-row-HT-input",
                                    child: [selectStatus]
                                }
                            ]
                        }]
                    },
                    {
                        tag: "div",
                        class: "pizo-list-realty-main-search-control-row-date",
                        child: [{
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-HT",
                            child: [{
                                    tag: "span",
                                    class: "pizo-list-realty-main-search-control-row-date-label",
                                    props: {
                                        innerHTML: "Thời gian tạo"
                                    }
                                },
                                {
                                    tag: "div",
                                    class: "pizo-list-realty-main-search-control-row-date-input",
                                    child: [
                                        startDay,
                                        endDay
                                    ]
                                }
                            ]
                        }]
                    },
                    {
                        tag: "div",
                        class: "pizo-list-realty-main-search-control-row-price",
                        child: [{
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-HT",
                            child: [{
                                    tag: "span",
                                    class: "pizo-list-realty-main-search-control-row-price-label",
                                    props: {
                                        innerHTML: "Khoảng giá"
                                    }
                                },
                                {
                                    tag: "div",
                                    class: "pizo-list-realty-main-search-control-row-price-input",
                                    child: [{
                                            tag: "input",
                                            class: "pizo-list-realty-main-search-control-row-price-input-low",
                                            props: {
                                                autocomplete: "off",
                                                placeholder: "đ Từ",
                                            },
                                            on: {
                                                input: function(event) {
                                                    this.value = formatNumber(this.value);
                                                },
                                                change: function(event) {
                                                    this.value = reFormatNumber(this.value);
                                                    var queryAll = [];
                                                    var query = [];
                                                    if (self.mapView.isPrice == true) {
                                                        if (self.lowprice.value != "")
                                                            query = [{ price: { operator: ">=", value: parseInt(self.lowprice.value) / 1000000000 } }];
                                                        if (self.highprice.value != "")
                                                            query.push({ price: { operator: "<=", value: parseInt(self.highprice.value) / 1000000000 } });
                                                    } else if (self.mapView.isPrice == false) {
                                                        if (self.lowprice.value != "")
                                                            query.push({ pricerent: { operator: ">=", value: parseInt(self.lowprice.value) } });
                                                        if (self.highprice.value != "")
                                                            query.push({ pricerent: { operator: "<", value: parseInt(self.highprice.value) } });
                                                    }
                                                    if (query.length == 2) {
                                                        query.splice(1, 0, "&&");
                                                    }
                                                    var queryAll = isQueryMap(self.stackQuery, query, "isPriceRange");
                                                    self.mapView.setGeneralOperator(queryAll);
                                                }
                                            }
                                        },
                                        {
                                            tag: "input",
                                            class: "pizo-list-realty-main-search-control-row-price-input-high",
                                            props: {
                                                autocomplete: "off",
                                                placeholder: "đ Đến",
                                            },
                                            on: {
                                                input: function(event) {
                                                    this.value = formatNumber(this.value);
                                                },
                                                change: function(event) {
                                                    this.value = reFormatNumber(this.value);
                                                    var queryAll = [];
                                                    var query = [];
                                                    if (self.mapView.isPrice == true) {
                                                        if (self.lowprice.value != "")
                                                            query = [{ price: { operator: ">=", value: parseInt(self.lowprice.value) / 1000000000 } }];
                                                        if (self.highprice.value != "")
                                                            query.push({ price: { operator: "<=", value: parseInt(self.highprice.value) / 1000000000 } });
                                                    } else if (self.mapView.isPrice == false) {
                                                        if (self.lowprice.value != "")
                                                            query.push({ pricerent: { operator: ">=", value: parseInt(self.lowprice.value) } });
                                                        if (self.highprice.value != "")
                                                            query.push({ pricerent: { operator: "<", value: parseInt(self.highprice.value) } });
                                                    }
                                                    if (query.length == 2) {
                                                        query.splice(1, 0, "&&");
                                                    }
                                                    self.priceQuery = query;
                                                    if (self.statusQuery && self.statusQuery.length > 0) {
                                                        queryAll = self.statusQuery.concat("&&");
                                                    }
                                                    queryAll = queryAll.concat(self.priceQuery);
                                                    self.mapView.setGeneralOperator(queryAll);
                                                }
                                            }
                                        },
                                    ]
                                }
                            ]
                        }]
                    }
                ]
            }]
        }]
    });
    var temp = _({
        tag: "div",
        class: "pizo-list-realty-main-search-control",
        on: {
            click: function(event) {
                this.hide();
            }
        },
        child: [
            content
        ]
    })

    temp.content = content;
    this.startDay = startDay;
    this.endDay = endDay;
    this.lowprice = $('input.pizo-list-realty-main-search-control-row-price-input-low', content);
    this.highprice = $('input.pizo-list-realty-main-search-control-row-price-input-high', content);
    this.phone = $('.pizo-list-realty-main-search-control-row-phone-input input', content);
    this.MS = $('.pizo-list-realty-main-search-control-row-MS-input input', content);
    this.SN = $('.pizo-list-realty-main-search-control-row-SN input', content);
    this.TD = $('.pizo-list-realty-main-search-control-row-TD input', content);
    this.PX = $('.pizo-list-realty-main-search-control-row-PX input', content);
    this.QH = $('.pizo-list-realty-main-search-control-row-QH input', content);
    this.HT = $('.pizo-list-realty-main-search-control-row-HT input', content);
    this.HTinput = $('div.pizo-list-realty-main-search-control-row-HT-input', content).childNodes[0];
    selectStatus.emit("change");
    self.lowprice = $(".pizo-list-realty-main-search-control-row-price-input-low", self.$view);
    self.highprice = $(".pizo-list-realty-main-search-control-row-price-input-high", self.$view);
    temp.show = function() {
        if (!temp.classList.contains("showTranslate"))
            temp.classList.add("showTranslate");
    }
    temp.hide = function() {
        if (!content.classList.contains("hideTranslate"))
            content.classList.add("hideTranslate");
        var eventEnd = function() {
            if (temp.classList.contains("showTranslate"))
                temp.classList.remove("showTranslate");
            content.classList.remove("hideTranslate");
            content.removeEventListener("webkitTransitionEnd", eventEnd);
            content.removeEventListener("transitionend", eventEnd);
        };
        // Code for Safari 3.1 to 6.0
        content.addEventListener("webkitTransitionEnd", eventEnd);

        // Standard syntax
        content.addEventListener("transitionend", eventEnd);
    }
    temp.apply = function() {

    }
    temp.reset = function() {
        this.timestart = new Date();
        this.timeend = new Date();
        this.lowprice.value = "";
        this.highprice.value = "";
        this.phone.value = "";
        this.MS.value = "";
        this.SN.value = "";
        this.TD.value = "";
        this.PX.value = "";
        this.QH.value = "";
        this.TT.value = "";
        this.HT.value = 0;
    }


    return temp;
}
MapRealty.prototype.refresh = function() {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

MapRealty.prototype.setData = function(data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

MapRealty.prototype.flushDataToView = function() {
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

MapRealty.prototype.start = function() {

}

export default MapRealty;