import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import '../../css/NewRealty.css';
import '../../css/imagesilder.css';
import { locationView,MapView } from "./MapView";
import { descViewImagePreview } from './ModuleImage'
import { unit_Long, unit_Zone, tableView } from './ModuleView';
import {formatNumber,reFormatNumber,formatFit} from './FormatFunction'
import R from '../R';
import Fcore from '../dom/Fcore';
import moduleDatabase from '../component/ModuleDatabase';

var _ = Fcore._;
var $ = Fcore.$;

function NewRealty(data) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.textHeader = "Sửa ";
    this.data = data;

    if(this.data ==undefined)
    this.textHeader = "Thêm ";
}

NewRealty.prototype.setContainer = function (parent) {
    this.parent = parent;
}

Object.defineProperties(NewRealty.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
NewRealty.prototype.constructor = NewRealty;

NewRealty.prototype.createPromise = function()
{
    var self = this;
    if(this.data === undefined)
    {
        self.promiseAddDB = new Promise(function(resolve,reject){
            self.resolveDB = resolve;
            self.rejectDB = reject;
        })

    }else
    {
        self.promiseEditDB = new Promise(function(resolve,reject){
            self.resolveDB = resolve;
            self.rejectDB = reject;
        })
        
    }
}

NewRealty.prototype.resetPromise = function(value)
{
    var self = this;
    if(self.promiseAddDB!==undefined)
    self.promiseAddDB = undefined;
    if(self.promiseEditDB!==undefined)
    self.promiseEditDB = undefined;
}

NewRealty.prototype.generalData = function () {
    for (var i = 0; i < this.header.length; i++) {
        if (this.header[i].value === undefined) {
            if (typeof this.header[i] === "object")
                value = "";
            else
                value = this.header[i];
        }
        else
            value = this.header[i].value;
        switch (value) {

        }
    }
}

NewRealty.prototype.getView = function () {
    // if(this.$view!==undefined)
    //     return this.$view;
    var self = this;
    this.$view = _({
        tag: "singlepage",
        class: "pizo-new-realty",
        child: [
            {
                class: 'absol-single-page-header',
                child: [
                    {
                        tag: "span",
                        class: "pizo-body-title-left",
                        props: {
                            innerHTML: self.textHeader+"dự án"
                        }
                    },
                    {
                        tag: "div",
                        class: "pizo-list-realty-button",
                        child: [
                            {
                                tag: "button",
                                class: ["pizo-list-realty-button-quit","pizo-list-realty-button-element"],
                                on: {
                                    click: function (evt) {
                                        self.$view.selfRemove();
                                        var arr = self.parent.body.getAllChild();
                                        self.parent.body.activeFrame(arr[arr.length - 1]);

                                        self.rejectDB(self.getDataSave());
                                    }
                                },
                                child: [
                                '<span>' + "Đóng" + '</span>'
                                ]
                            },
                            {
                                tag: "button",
                                class: ["pizo-list-realty-button-add","pizo-list-realty-button-element"],
                                on: {
                                    click: function (evt) {
                                        self.resolveDB(self.getDataSave());
                                        self.createPromise();
                                    }
                                },
                                child: [
                                '<span>' + "Lưu" + '</span>'
                                ]
                            },
                            {
                                tag: "button",
                                class: ["pizo-list-realty-button-add","pizo-list-realty-button-element"],
                                on: {
                                    click: function (evt) {
                                        self.resolveDB(self.getDataSave());
                                        self.$view.selfRemove();
                                        var arr = self.parent.body.getAllChild();
                                        self.parent.body.activeFrame(arr[arr.length - 1]);
                                    }
                                },
                                child: [
                                '<span>' + "Lưu và đóng" + '</span>'
                                ]
                            }
                        ]
                    }
                ]
            },
        ]
    })

    this.$view.addChild(_({
        tag: "div",
        class: ["pizo-list-realty-main"],
        child: [
            this.descView()
        ]
    }));
    self.createPromise();
    return this.$view;
}

NewRealty.prototype.descView = function () {
    this.checkAddress = moduleDatabase.getModule("addresses").getLibary("id");
    this.checkStreet = moduleDatabase.getModule("streets").getLibary("id");
    this.checkWard = moduleDatabase.getModule("wards").getLibary("id");
    this.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");
    this.checkState = moduleDatabase.getModule("states").getLibary("id");

    this.containerMap = _({
        tag: "div"
    })
    this.contactView = this.contactView();
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-desc",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-desc-content",
                child: [
                    this.containerMap
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-desc-infomation",
                child: [
                   
                    {
                        tag: "div",
                        class: ["pizo-new-realty-desc-infomation-cell", "center-child"],
                        child: [
                            this.convenientView(),
                            this.contactView
                        ]
                    },
                    {
                        tag: "div",
                        class: "pizo-new-realty-desc-infomation-cell",
                        child: [
                            this.juridicalView(),
                            this.historyView(),
                            // this.descViewImageThumnail(dataImage,0,x)
                        ]
                    }
                ]
            }
        ]
    });
    var container = $("div.pizo-new-realty-desc-content",temp);
    container.insertBefore(this.descViewdetail(),container.firstChild);
    var container = $("div.pizo-new-realty-desc-infomation",temp);
    container.insertBefore(this.detructView(),container.firstChild);
    return temp;
}

NewRealty.prototype.descViewImageThumnail = function (dataImage, index, promiseLazyLoad) {

    var temp = _({
        tag: "div",
        class: ["pizo-new-relty-desc-content-thumnail", "pizo-new-realty-dectruct-content-area-size-zone"],
        child: [
            {
                // tag:"div",
                // class:"mtm",
                // child:[
                //     {
                //         tag:"div",
                //         style:{
                //             position:"relative"
                //         }
                //     }
                // ]
                tag: "img",
                props: {
                    src: dataImage[0].src
                }
            }
        ],
        on: {
            click: function (event) {
                document.body.appendChild(descViewImagePreview(dataImage, index, promiseLazyLoad));
                // xmlModalDragImage.createModal(document.body,function(){
                //     
                // });
            }
        }
    })

    switch (dataImage.length) {
        case 1:
            break;
        case 2:
        //chia doi
        case 3:
        case 4:
        case 5:
    }
    return temp;
}

NewRealty.prototype.itemAdress = function (addressid = 0) {


    var self = this;
    var text = _({ text: "Địa chỉ" });
    var important = _({
        tag: "span",
        class: "pizo-new-realty-location-detail-row-label-important",
        props: {
            innerHTML: "*"
        }
    });
    var temp = _({
        tag: "div",
        class: ["pizo-new-realty-desc-detail-row", "adressItemCheck"],
        child: [
            {
                tag: "span",
                class: "pizo-new-realty-desc-detail-1-row-label",
                child: [
                    text,
                    important
                ]

            },
            {
                tag: "input",
                class: ["pizo-new-realty-desc-detail-1-row-input"],
                on: {
                    click: function (event) {
                        this.blur();
                        var selfElement = this;
                        var childNode = locationView(function (value) {
                            selfElement.value = value.input.value;
                            temp.data = childNode.getDataCurrent();
                            temp.selfRemoveChild(value.input.value, childNode);
                            childRemove.selfRemove();

                        },temp.data)
                        var childRemove = _({
                            tag: "modal",
                            on: {
                                click: function (event) {
                                    var target = event.target;
                                    while (target !== childNode && target !== childRemove && target !== document.body)
                                        target = target.parentNode;
                                    if (target === childRemove)
                                        childRemove.selfRemove();
                                }
                            },
                            child: [
                                childNode
                            ]
                        })
                        temp.appendChild(childRemove)
                    }
                }
            }
        ]
    })
    temp.label = text;
    temp.important = important;
    temp.updateIndex = function (index) {
        temp.index = index;
        if (index == 0)
        {
            index = "";
        }else
        temp.important.style.display = "none";
            
        temp.label.data = "Địa chỉ " + index;
    }
    temp.parentUpdateIndex = function () {
        var k = 0;
        for (var i = 0; i < temp.parentNode.childNodes.length; i++) {
            if (!temp.parentNode.childNodes[i].classList.contains("adressItemCheck"))
                return;
            temp.parentNode.childNodes[i].updateIndex(k++);
        }
    }
    temp.selfRemoveChild = function (value,childNode) {
        temp.value = value;
    
        var next = temp;
        while (next.nextSibling!==null)
            next = next.nextSibling;
        if (value === "") {
            
            switch (temp.index) {
                case undefined:
                case 0:
                    if (temp.nextSibling.classList.contains("adressItemCheck")&&(temp.nextSibling.value === "" || temp.nextSibling.value === undefined)) {
                        temp.nextSibling.selfRemove();
                    }
                    var containerMap = _({
                        tag: "div"
                    })
                    self.containerMap.parentNode.replaceChild(containerMap, self.containerMap);
                    self.containerMap = containerMap;
                    break;
                case 1:
                case 2:
                    if (next !== temp){
                        if (next.value === "" || next.value === undefined) {
                            var prev = temp.previousSibling;
                            temp.selfRemove();
                            prev.parentUpdateIndex();
    
                        } else {
                            temp.parentNode.insertBefore(temp, next.nextSibling);
                            temp.parentUpdateIndex();
                        }
                    }
                    break;
                case 3:
                    break;

            }
            return true;
        } else {
            switch(temp.index)
            {
                case undefined:
                case 0:
                    if (childNode.map.currentMarker !== undefined) {
                        childNode.map.currentMarker.setDraggable(false);
                        self.containerMap.parentNode.replaceChild(childNode.map, self.containerMap);
                        self.containerMap = childNode.map;
                    }
                    if(next === temp)
                    {
                        temp.parentNode.insertBefore(self.itemAdress(), temp.nextSibling);
                        temp.parentUpdateIndex();
                    }
                    break;
                case 1:
                case 2:
                    if(next === temp)
                    {
                        temp.parentNode.insertBefore(self.itemAdress(), temp.nextSibling);
                        temp.parentUpdateIndex();
                    }
                    break;
            }
            
            return false;
        }
        
    }
    this.inputAdress = $('input.pizo-new-realty-desc-detail-1-row-input',temp);
    if(addressid!==0)
    {
        var number = this.checkAddress[addressid].addressnumber;
        var street = this.checkStreet[this.checkAddress[addressid].streetid].name;
        var ward = this.checkWard[this.checkAddress[addressid].wardid].name;
        var district = this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].name;
        var state = this.checkState[this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].stateid].name;
        $("input.pizo-new-realty-desc-detail-1-row-input",temp).value = number+" "+street+", "+ward+", "+district+", "+state;
        temp.data = {
            id:addressid,
            number:this.checkAddress[addressid].addressnumber,
            street:this.checkStreet[this.checkAddress[addressid].streetid].name+"_"+this.checkAddress[addressid].streetid,
            ward:this.checkWard[this.checkAddress[addressid].wardid].name+"_"+this.checkAddress[addressid].wardid,
            district:this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].name+"_"+this.checkWard[this.checkAddress[addressid].wardid].districtid,
            state:this.checkState[this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].stateid].name+"_"+this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].stateid,
            lng:this.checkAddress[addressid].lng,
            lat:this.checkAddress[addressid].lat,
        }
    }
    return temp;
}

NewRealty.prototype.descViewdetail = function () {
    var self = this;
    var containerAdress = _({
        tag:"div",
        style:{
            marginBottom:"10px"
        }
    });
    var index = "";
    var last;
    if(this.data!==undefined)
    {
        for(var i = 0;i<4;i++)
        {      
            if(this.data.original["addressid"+index]==0||this.data.original["addressid"+index]==undefined)
            break;
            last = this.itemAdress(this.data.original["addressid"+index])
            containerAdress.appendChild(last);
            if(i===0)
            {
                var map = MapView();
                map.activePlanningMap();
                map.addMapPolygon();
                var address = this.checkAddress[this.data.original["addressid"+index]];
                map.addMoveMarker([address.lng,address.lat],false);
                map.currentMarker.setDraggable(false);
                this.containerMap.parentNode.replaceChild(map, this.containerMap);
                this.containerMap = map;
            }
            index = i+2;
        }
    }
    if(i == undefined||i<3)
    {
        last = this.itemAdress();
        containerAdress.appendChild(last);
    }
    
    last.parentUpdateIndex();
    var temp = _({
        tag: "div",
        class: ["pizo-new-realty-desc-detail", "pizo-new-realty-dectruct-content-area-size-zone"],
        child: [ 
            containerAdress,
            {
                tag: "div",
                class: "pizo-new-realty-desc-detail-row",
                child: [
                    {
                        tag: "div",
                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                        child: [
                            {
                                tag: "div",
                                class: "pizo-new-realty-desc-detail-row",
                                child: [
                                    {
                                        tag: "span",
                                        class: "pizo-new-realty-desc-detail-row-cell-label",
                                        props: {
                                            innerHTML: "Tên"
                                        }
                                    },
                                    {
                                        tag: "input",
                                        class: "pizo-new-realty-desc-detail-row-cell-input",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag: "div",
                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                        child: [
                            {
                                tag: "div",
                                class: "pizo-new-realty-desc-detail-row",
                                child: [
                                    {
                                        tag: "span",
                                        class: "pizo-new-realty-desc-detail-row-cell-label",
                                        props: {
                                            innerHTML: "Hiện trạng"
                                        },
                                        child: [
                                            {
                                                tag: "span",
                                                class: "pizo-new-realty-location-detail-row-label-important",
                                                props: {
                                                    innerHTML: "*"
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-desc-detail-row-cell-menu-1",
                                        child: [
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-desc-detail-row",
                                                child: [
                                                    {
                                                        tag: "span",
                                                        class: "pizo-new-realty-desc-detail-row-cell-menu-1-span",
                                                        props: {
                                                            innerHTML: "Còn bán"
                                                        }
                                                    },
                                                    {
                                                        tag: "checkbox",
                                                        class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-desc-detail-row-cell-menu-2",
                                        child: [
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-desc-detail-row",
                                                child: [
                                                    {
                                                        tag: "span",
                                                        class: "pizo-new-realty-desc-detail-row-cell-menu-2-span",
                                                        props: {
                                                            innerHTML: "Còn cho thuê"
                                                        }
                                                    },
                                                    {
                                                        tag: "checkbox",
                                                        class: "pizo-new-realty-desc-detail-row-menu-2-checkbox"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-desc-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-desc-detail-row-label",
                        props: {
                            innerHTML: "Mô tả"
                        },

                    },
                    {
                        tag: "textarea",
                        style: {
                            height: "15em"
                        },
                        class: "pizo-new-realty-desc-detail-row-input",
                        on: {
                            click: function () {
                            }
                        }
                    }
                ]
            }]
    });
    this.inputName = $('input.pizo-new-realty-desc-detail-row-cell-input',temp);
    this.inputLease = $('div.pizo-new-realty-desc-detail-row-menu-2-checkbox',temp);
    this.inputSell = $('div.pizo-new-realty-desc-detail-row-menu-1-checkbox',temp);
    this.inputContent = $('textarea.pizo-new-realty-desc-detail-row-input',temp);
    this.containerAdress = containerAdress;
    return temp;
}


NewRealty.prototype.detructView = function () {
    var unitHeight = unit_Long(function (event) {
        var height = $('input.pizo-new-realty-dectruct-content-area-height', temp);
        height.value = height.value * event.lastValue / event.value;
    });
    var unitWidth =  unit_Long(function (event) {
        var width = $('input.pizo-new-realty-dectruct-content-area-width', temp);
        width.value = width.value * event.lastValue / event.value;
    })
    var unit_Zone_1 =  unit_Zone(function (event) {
        var area1 = $('input.pizo-new-realty-dectruct-content-area-1', temp);
        area1.value = area1.value * event.lastValue / event.value;
    });
    var unit_Zone_2 = unit_Zone(function (event) {
        var area2 = $('input.pizo-new-realty-dectruct-content-area-2', temp);
        area2.value = area2.value * event.lastValue / event.value;
    });
    var unit_Zone_all = unit_Zone(function (event) {
        var area2 = $('pizo-new-realty-dectruct-content-area-all', temp);
        area2.value = area2.value * event.lastValue / event.value;
    });
    var unitWidthRoad =  unit_Long(function (event) {
        var width = $('input.pizo-new-realty-dectruct-content-area-access', temp);
        width.value = width.value * event.lastValue / event.value;
    })

    var temp = _({
        tag: "div",
        class: "pizo-new-realty-dectruct",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-dectruct-tab",
                props: {
                    innerHTML: "Thông tin xây dựng"
                }
            },
            {
                tag: "div",
                class: "pizo-new-realty-dectruct-content",
                child: [
                    {
                        tag: "div",
                        class: "pizo-new-realty-dectruct-content-area",
                        child: [
                            {
                                tag: "span",
                                class: "pizo-new-realty-detruct-content-area-label",
                                props: {
                                    innerHTML: "Diện tích"
                                },
                            },
                            {
                                tag: "div",
                                class: "pizo-new-realty-dectruct-content-area-size",
                                child: [
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-desc-detail-row",
                                                child: [
                                                    {
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
                                                            change: function (event) {
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
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-desc-detail-row",
                                                child: [
                                                    {
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
                                                            change: function (event) {
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
                                            }
                                        ]
                                    },

                                ]
                            },
                            {
                                tag: "div",
                                class: "pizo-new-realty-dectruct-content-area-size",
                                child: [
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-desc-detail-row",
                                                child: [
                                                    {
                                                        tag: "span",
                                                        class: "pizo-new-realty-dectruct-content-area-1-label",
                                                        props: {
                                                            innerHTML: "Diện tích"
                                                        },
                                                    },
                                                    {
                                                        tag: "input",
                                                        class: ["pizo-new-realty-dectruct-content-area-all", "pizo-new-realty-dectruct-input"],
                                                        on:{
                                                            change:function(event){
                                                                var inputValue = $("input.pizo-new-realty-detruct-content-price-per",temp);
                                                                var price = $('input.pizo-new-realty-detruct-content-price', temp);
                                                                var priceUnit = $('div.pizo-new-realty-detruct-content-price-unit', temp);
                                                                
                                                                var areaValue = $('input.pizo-new-realty-dectruct-content-area-all', temp);
                                                                var areaValueUnit = unit_Zone_all;
                                                                inputValue.value = price.value*priceUnit.value/(areaValue.value*areaValueUnit.value)*1000;
                                                            }
                                                        },
                                                        attr: {
                                                            type: "number",
                                                            min: 0
                                                        }
                                                    },
                                                    unit_Zone_all
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-desc-detail-row",
                                                child: [
                                                    {
                                                        tag: "span",
                                                        class: "pizo-new-realty-dectruct-content-area-2-label",
                                                        props: {
                                                            innerHTML: "Kết cấu"
                                                        },
                                                    },
                                                    {
                                                        tag: "selectmenu",
                                                        class: "pizo-new-realty-detruct-content-structure",
                                                        props: {
                                                            items: [
                                                               {text:"Chưa xác định",value:0},
                                                               {text:"Đất trống",value:1},
                                                               {text:"Kết cấu",value:2},
                                                               {text:"Cấp 4",value:3},
                                                               {text:"Sẳn *",value:4},
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag: "div",
                                class: "pizo-new-realty-dectruct-content-area-size",
                                child: [
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-desc-detail-row",
                                                child: [
                                                    {
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
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-desc-detail-row",
                                                child: [
                                                    {
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
                                            }
                                        ]
                                    }
                                ]
                            },

                        ]
                    },
                     {
                        tag: "div",
                        class: "pizo-new-realty-dectruct-content-area",
                        child: [
                            {
                                tag: "div",
                                class: ["pizo-new-realty-dectruct-content-area-size-zone", "no-margin-style"],
                                child: [
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-desc-detail-row",
                                        child: [
                                            {
                                                tag: "span",
                                                class: "pizo-new-realty-detruct-content-area-label",
                                                props: {
                                                    innerHTML: "Giá"
                                                },
                                            },
                                            {
                                                tag: "input",
                                                class: ["pizo-new-realty-detruct-content-price","pizo-new-realty-dectruct-input"],
                                                props:{
                                                    value:0
                                                },
                                                on:{
                                                    change:function(event)
                                                    {
                                                        var inputValue = $("input.pizo-new-realty-detruct-content-price-per",temp);
                                                        var price = $('input.pizo-new-realty-detruct-content-price', temp);
                                                        var priceUnit = $('div.pizo-new-realty-detruct-content-price-unit', temp)
                                                         
                                                        var areaValue = $('input.pizo-new-realty-dectruct-content-area-all', temp);
                                                        var areaValueUnit = unit_Zone_all;
                                                        inputValue.value = price.value*priceUnit.value/(areaValue.value*areaValueUnit.value)*1000;
                                                    }
                                                }
                                            },
                                            {
                                                tag:"selectmenu",
                                                class:  "pizo-new-realty-detruct-content-price-unit",
                                                on:{
                                                    change:function(event){
                                                        var price = $('input.pizo-new-realty-detruct-content-price', temp);
                                                        price.value = price.value * event.lastValue / event.value;
                                                    }
                                                },
                                                props:{
                                                    items:[
                                                        {text:"tỉ",value:1},
                                                        {text:"triệu",value:1/1000}
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag: "div",
                                class: ["pizo-new-realty-dectruct-content-area-size-zone", "margin-style"],
                                child: [
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-desc-detail-row",
                                        child: [
                                            {
                                                tag: "span",
                                                class: "pizo-new-realty-detruct-content-area-label",
                                                props: {
                                                    innerHTML: "Giá m²"
                                                },
                                            },
                                            {
                                                tag: "input",
                                                class: ["pizo-new-realty-detruct-content-price-per","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    disabled:""
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag: "div",
                        class: "pizo-new-realty-dectruct-content-area",
                        child: [
                            {
                                tag: "div",
                                class: ["pizo-new-realty-dectruct-content-area-size-zone", "no-margin-style"],
                                child: [
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-desc-detail-row",
                                        child: [
                                            {
                                                tag: "span",
                                                class: ["pizo-new-realty-detruct-content-price-rent-label","pizo-new-realty-detruct-content-area-label"],
                                                props: {
                                                    innerHTML: "Giá thuê tháng"
                                                },
                                            },
                                            {
                                                tag: "input",
                                                class: ["pizo-new-realty-detruct-content-price-rent","pizo-new-realty-dectruct-input"],
                                                on:{
                                                    input:function(event)
                                                    {
                                                        this.value = formatNumber(this.value);
                                                    },
                                                    blur:function(event)
                                                    {
                                                        this.value = reFormatNumber(this.value);
                                                    }
                                                }
                                            },
                                            {
                                                tag:"selectmenu",
                                                class:  "pizo-new-realty-detruct-content-price-rent-unit",
                                                on:{
                                                    change:function(event){
                                                        var price = $('input.pizo-new-realty-detruct-content-price-rent', temp);
                                                        price.value = (price.value * event.lastValue / event.value);
                                                    }
                                                },
                                                props:{
                                                    items:[
                                                        {text:"VND",value:1},
                                                        {text:"USD",value:23180}
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag: "div",
                                class: ["pizo-new-realty-dectruct-content-area-size-zone", "margin-style"],
                                child: [
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-desc-detail-row",
                                        child: [
                                            {
                                                tag: "span",
                                                class: "pizo-new-realty-detruct-content-area-label",
                                                style:{
                                                    width: "fit-content",
                                                    alignItems: "center",
                                                    height: "30px"
                                                },
                                                props: {
                                                    innerHTML: "Kiểm duyệt"
                                                },
                                            },
                                            {
                                                tag: "checkbox",
                                                class: ["pizo-new-realty-detruct-content-censorship"]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag: "div",
                        class: "pizo-new-realty-dectruct-content-area",
                        child: [
                            {
                                tag: "div",
                                class: ["pizo-new-realty-dectruct-content-area-size-zone", "no-margin-style"],
                                child: [
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-desc-detail-row",
                                        child: [
                                            {
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
                                                        { text:"Chưa xác định", value:0},
                                                        { text: "Đông", value: 6},
                                                        { text: "Tây", value: 4 },
                                                        { text: "Nam", value: 2 },
                                                        { text: "Bắc", value: 8 },
                                                        { text: "Đông Bắc", value: 9 },
                                                        { text: "Đông Nam", value: 3 },
                                                        { text: "Tây Bắc", value: 7 },
                                                        { text: "Tây Nam", value: 1 },
                                                    ]
                                                }
                                            },
                                        ]
                                    }
                                ]
                            },
                            {
                                tag: "div",
                                class: ["pizo-new-realty-dectruct-content-area-size-zone", "margin-style"],
                                child: [
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-desc-detail-row",
                                        child: [
                                            {
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
                                                    items: [
                                                        { text: "Chưa xác định", value:0},
                                                        { text: "Hẻm", value: 1 },
                                                        { text: "Mặt tiền", value: 2 },
                                                        { text: "Chung cư", value: 3 },
                                                    ]
                                                }
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag: "div",
                        class: "pizo-new-realty-dectruct-content-area-right",
                        child: [
                            {
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
                                    items:[
                                        {text:"Để ở",value:1},
                                        {text:"Cho thuê",value:10},
                                        {text:"Kinh doanh",value:100},
                                        {text:"Làm văn phòng",value:1000},
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        tag: "div",
                        class: "pizo-new-realty-dectruct-content-area-right",
                        child: [
                            {
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
                                props:{
                                    value:0
                                }
                            },
                            unitWidthRoad
                        ]
                    },
                    {
                        tag: "div",
                        class: "pizo-new-realty-dectruct-content-area",
                        child: [
                            {
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
                                class: "pizo-new-realty-dectruct-content-area-size",
                                child: [
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-desc-detail-row",
                                                child: [
                                                    {
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
                                                        props:{
                                                            value:0
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-desc-detail-row",
                                                child: [
                                                    {
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
                                                        props:{
                                                            value:0
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    
                                ]
                            },
                            {
                                tag: "div",
                                class: "pizo-new-realty-dectruct-content-area-size",
                                child: [
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-desc-detail-row",
                                                child: [
                                                    {
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
                                                        props:{
                                                            value:0
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-desc-detail-row",
                                                child: [
                                                    {
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
                                                        props:{
                                                            value:0
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag: "div",
                                class: "pizo-new-realty-dectruct-content-area-size",
                                child: [
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-desc-detail-row",
                                                child: [
                                                    {
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
                                                        props:{
                                                            value:0
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-desc-detail-row",
                                                child: [
                                                    {
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
                                                        props:{
                                                            value:0
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },

                        ]
                    },

                ]
            }
        ]
    })
    this.inputHeight = $('input.pizo-new-realty-dectruct-content-area-height.pizo-new-realty-dectruct-input',temp);
    this.inputWidth = $('input.pizo-new-realty-dectruct-content-area-width.pizo-new-realty-dectruct-input',temp);
    this.inputUnitHeight = unitHeight;
    this.inputUnitWidth = unitWidth;
    this.inputZone1 = $('input.pizo-new-realty-dectruct-content-area-1.pizo-new-realty-dectruct-input',temp);
    this.inputZone2 = $('input.pizo-new-realty-dectruct-content-area-2.pizo-new-realty-dectruct-input',temp);
    this.inputUnitZone1 = unit_Zone_1;
    this.inputUnitZone2 = unit_Zone_2;
    this.inputZoneAll = $('input.pizo-new-realty-dectruct-content-area-all',temp);
    this.inputUnitZoneAll = unit_Zone_all;
    this.inputPrice = $('input.pizo-new-realty-detruct-content-price',temp);
    this.inputUnitPrice = $('div.pizo-new-realty-detruct-content-price-unit',temp);
    this.inputPriceRent = $('input.pizo-new-realty-detruct-content-price-rent',temp);
    this.inputPriceRentUnit = $('div.pizo-new-realty-detruct-content-price-rent-unit',temp);
    this.inputCensorship = $('div.pizo-new-realty-detruct-content-censorship',temp);
    this.inputFit = $('div.pizo-new-realty-dectruct-content-area-fit',temp);
    this.direction = $('div.pizo-new-realty-detruct-content-direction',temp);
    this.structure = $('div.pizo-new-realty-detruct-content-structure',temp);
    this.type = $('div.pizo-new-realty-detruct-content-type',temp);
    this.inputWidthRoad = $('input.pizo-new-realty-dectruct-content-area-access', temp);
    this.inputUnitWidthRoad = unitWidthRoad;
    this.inputBedroom = $('input.pizo-new-realty-dectruct-content-area-bedroom', temp);
    this.inputKitchen = $('input.pizo-new-realty-dectruct-content-area-kitchen', temp);
    this.inputToilet = $('input.pizo-new-realty-dectruct-content-area-toilet',temp);
    this.inputLiving = $('input.pizo-new-realty-dectruct-content-area-living',temp);
    this.inputBasement = $('input.pizo-new-realty-dectruct-content-area-basement',temp);
    this.inputFloor = $('input.pizo-new-realty-dectruct-content-area-floor',temp);
    this.censorship = $('div.pizo-new-realty-detruct-content-censorship',temp);



    if(this.data!==undefined)
    {
        var original = this.data.original;
        this.inputHeight.value = original.height;
        this.inputWidth.value = original.width;
        this.inputZone1.value = original.landarea;
        this.inputZone2.value = original.floorarea;
        this.inputZoneAll.value = original.acreage;
        this.direction.value = original.direction;
        this.type.value = original.type;
        this.inputFit.value = original.fit;
        this.inputWidthRoad.value = original.roadwidth;
        this.inputFloor.value = original.floor;
        this.inputBasement.value = original.basement;
        this.inputBedroom.value = original.bedroom;
        this.inputLiving.value = original.living;
        this.inputToilet.value = original.toilet;
        this.inputKitchen.value = original.kitchen;
        this.inputPrice.value = original.price;
        this.inputPriceRent.value = original.pricerent;
        this.structure.value = original.structure;
        this.inputName.value = original.name;
        var checkStatus = parseInt(original.salestatus);
        this.inputLease.checked = parseInt(checkStatus/10)==1?true:false;
        this.inputSell.checked = parseInt(checkStatus%10)==1?true:false;
        this.inputContent.value = original.content;
        this.censorship.checked = original.censorship==1?true:false;
        this.inputFit.values = formatFit(parseInt(original.fit));
        this.inputPrice.emit("change");
    }
    return temp;
}

NewRealty.prototype.getDataSave = function(){
    var fitUpdate = 0;
    if(this.inputFit.values.length!==0)
    fitUpdate = this.inputFit.values.reduce(function(a, b) { return a + b; })
    var temp = {
        height:this.inputHeight.value*this.inputUnitHeight.value,
        width:this.inputWidth.value*this.inputUnitWidth.value,
        landarea:this.inputZone1.value*this.inputUnitZone1.value,
        floorarea:this.inputZone2.value*this.inputUnitZone2.value,
        acreage:this.inputZoneAll.value*this.inputUnitZoneAll.value,
        direction:this.direction.value,
        type:this.type.value,
        fit:fitUpdate,
        roadwidth:this.inputWidthRoad.value*this.inputUnitWidthRoad.value,
        floor:this.inputFloor.value,
        basement:this.inputBasement.value,
        bedroom:this.inputBedroom.value,
        living:this.inputLiving.value,
        toilet:this.inputToilet.value,
        kitchen:this.inputKitchen.value,
        price:this.inputPrice.value*this.inputUnitPrice.value,
        name:this.inputName.value,
        content:this.inputContent.value,
        salestatus:(this.inputLease.checked==true?1:0)*10+(this.inputSell.checked==true?1:0),
        structure:this.structure.value,
        pricerent:reFormatNumber(this.inputPriceRent.value)*this.inputPriceRentUnit.value,
        censorship:this.censorship.checked==true?1:0
    }
    var index = "";

    for(var i=0;i<this.containerAdress.childNodes.length;i++)
    {
       
        if(this.containerAdress.childNodes[i].data!==undefined)
        {
            var indexString = "addressid"+index;
            var address = {};
            var data = this.containerAdress.childNodes[i].data;

            var lastIndex = data.ward.lastIndexOf("_");
            if(lastIndex === -1)
            {
                address.ward = data.ward;
                lastIndex = data.district.lastIndexOf("_");
                if(lastIndex == -1)
                {
                    address.district = data.district;
                    lastIndex = data.state.lastIndexOf("_");
                    if(lastIndex == -1)
                    {
                        address.state = data.state;
                    }else
                    {
                        address.stateid = data.state.slice(lastIndex+1);
                    }
                }
                else
                    address.districtid = data.district.slice(lastIndex+1);
            }
            else
            address.wardid = data.ward.slice(lastIndex+1);
            
            var lastIndex = data.street.lastIndexOf("_");
            if(lastIndex === -1)
            address.street = data.street;
            else
            address.streetid = data.street.slice(lastIndex+1);

            address.number = data.number;

            address.lat = data.lat;

            address.lng = data.lng;

            temp[indexString] = address;
            index = i+2;
        }
    }

    for(var i = 0;i<this.contactView.childNodes.length;i++)
    {
        console.log(this.contactView.childNodes[i]);
    }

    if(this.data!==undefined)
    temp.id = this.data.original.id;
    console.log(temp);
    return temp;
}

NewRealty.prototype.utilityView = function () {
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-utility",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-utility-tab",
                props: {
                    innerHTML: "Tiện ích xung quanh"
                }
            },
            {
                tag: "div",
                class: "pizo-new-realty-dectruct-content",
                child: [
                    {
                        tag: "div",
                        class: "pizo-new-realty-dectruct-content-area",
                        child: [
                            {
                                tag: "div",
                                class: "pizo-new-realty-dectruct-content-area-size",
                                child: [
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "span",
                                                class: "pizo-new-realty-dectruct-content-area-pool-label",
                                                props: {
                                                    innerHTML: "Bể bơi"
                                                },
                                            },
                                            {
                                                tag: "input",
                                                class: ["pizo-new-realty-dectruct-content-area-pool", "pizo-new-realty-dectruct-input"],
                                                attr: {
                                                    type: "number"
                                                }
                                            },
                                            unit_Long(),
                                        ],
                                        on: {

                                        }
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "span",
                                                class: "pizo-new-realty-dectruct-content-area-gym-label",
                                                props: {
                                                    innerHTML: "Phòng Gym"
                                                },
                                            },
                                            {
                                                tag: "input",
                                                class: ["pizo-new-realty-dectruct-content-area-gym", "pizo-new-realty-dectruct-input"],
                                                attr: {
                                                    type: "number"
                                                }
                                            },
                                            unit_Long()
                                        ]
                                    }
                                ]
                            }, {
                                tag: "div",
                                class: "pizo-new-realty-dectruct-content-area-size",
                                child: [
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "span",
                                                class: "pizo-new-realty-dectruct-content-area-supermarket-label",
                                                props: {
                                                    innerHTML: "Siêu thị"
                                                },
                                            },
                                            {
                                                tag: "input",
                                                class: ["pizo-new-realty-dectruct-content-area-supermarket", "pizo-new-realty-dectruct-input"],
                                                attr: {
                                                    type: "number"
                                                }
                                            },
                                            unit_Long(),
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "span",
                                                class: "pizo-new-realty-dectruct-content-area-market-label",
                                                props: {
                                                    innerHTML: "Chợ"
                                                },
                                            },
                                            {
                                                tag: "input",
                                                class: ["pizo-new-realty-dectruct-content-area-market", "pizo-new-realty-dectruct-input"],
                                                attr: {
                                                    type: "number"
                                                }
                                            },
                                            unit_Long()
                                        ]
                                    }
                                ]
                            },
                            {
                                tag: "div",
                                class: "pizo-new-realty-dectruct-content-area-size",
                                child: [
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "span",
                                                class: "pizo-new-realty-dectruct-content-area-hospital-label",
                                                props: {
                                                    innerHTML: "Bệnh viện"
                                                },
                                            },
                                            {
                                                tag: "input",
                                                class: ["pizo-new-realty-dectruct-content-area-hospital", "pizo-new-realty-dectruct-input"],
                                                attr: {
                                                    type: "number"
                                                }
                                            },
                                            unit_Long(),
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                                        child: [
                                            {
                                                tag: "span",
                                                class: "pizo-new-realty-dectruct-content-area-park-label",
                                                props: {
                                                    innerHTML: "Công viên"
                                                },
                                            },
                                            {
                                                tag: "input",
                                                class: ["pizo-new-realty-dectruct-content-area-park", "pizo-new-realty-dectruct-input"],
                                                attr: {
                                                    type: "number"
                                                }
                                            },
                                            unit_Long()
                                        ]
                                    }
                                ]
                            },
                            {
                                tag: "div",
                                class: "pizo-new-realty-dectruct-content-area-size",
                                child: [
                                    {
                                        tag: "span",
                                        class: "pizo-new-realty-detruct-content-area-label",
                                        props: {
                                            innerHTML: "Trường học"
                                        },
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-size",
                                        child: [

                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-dectruct-content-area-size-zone",
                                                child: [
                                                    {
                                                        tag: "span",
                                                        class: "pizo-new-realty-dectruct-content-area-preschool-label",
                                                        props: {
                                                            innerHTML: "Mầm non"
                                                        },
                                                    },
                                                    {
                                                        tag: "input",
                                                        class: ["pizo-new-realty-dectruct-content-area-preschool", "pizo-new-realty-dectruct-input"],
                                                        attr: {
                                                            type: "number"
                                                        }
                                                    },
                                                    unit_Long(),
                                                ]
                                            },
                                            {
                                                tag: "div",
                                                class: "pizo-new-realty-dectruct-content-area-size-zone",
                                                child: [
                                                    {
                                                        tag: "span",
                                                        class: "pizo-new-realty-dectruct-content-area-highschool-label",
                                                        props: {
                                                            innerHTML: "Phổ thông"
                                                        },
                                                    },
                                                    {
                                                        tag: "input",
                                                        class: ["pizo-new-realty-dectruct-content-area-highschool", "pizo-new-realty-dectruct-input"],
                                                        attr: {
                                                            type: "number"
                                                        }
                                                    },
                                                    unit_Long()
                                                ]
                                            }
                                        ]
                                    }

                                ]
                            },
                        ]
                    }
                ]
            }
        ]
    })
    return temp;
}

NewRealty.prototype.convenientView = function () {
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-convenient",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-convenient-tab",
                props: {
                    innerHTML: "Tiện ích trong nhà"
                }
            },
            {
                tag: "div",
                class: "pizo-new-realty-convenient-content",
                child: [
                    {
                        tag: "div",
                        class: "pizo-new-realty-convenient-content-size",
                        child: [
                        ]
                    }
                ]
            }
        ]
    })
    return temp;
}


NewRealty.prototype.convenientView = function () {
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-convenient",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-convenient-tab",
                props: {
                    innerHTML: "Tiện ích trong nhà"
                }
            },
            {
                tag: "div",
                class: "pizo-new-realty-convenient-content",
                child: [
                    {
                        tag: "div",
                        class: "pizo-new-realty-convenient-content-size",
                        child: [
                        ]
                    }
                ]
            }
        ]
    })
    return temp;
}

NewRealty.prototype.contactItem = function(data){
    var relate = 1;
    if(data.original.statusphone !== undefined)
    {
        relate = data.original.statusphone;
    }
    var temp = _({
        tag:"div",
        class:"pizo-new-realty-contact-item",
        child:[
            {
                tag:"div",
                class:"pizo-new-realty-contact-item-name",
                child:[
                    {
                        tag:"span",
                        class:"pizo-new-realty-contact-item-name-label",
                        props:{
                            innerHTML:"Tên"
                        }
                    },
                    {
                        tag:"input",
                        class:"pizo-new-realty-contact-item-name-input",
                        props:{
                            value:data.original.name
                        }
                    },
                    {
                        tag:"selectmenu",
                        class:"pizo-new-realty-contact-item-name-selectbox",
                        props:{
                            items:[
                                {text:"Chưa xác định",value:0},
                                {text:"Môi giới", value:1},
                                {text:"Chủ nhà",value:2},
                                {text:"Họ hàng",value:3}
                            ]
                        }
                    },
                    {
                        tag:"button",
                        class:"pizo-new-realty-contact-item-close",
                        on:{
                            click:function(event){
                                temp.selfRemove();
                            }
                        },
                        child:[
                            {
                                tag:"i",
                                class:"material-icons",
                                style:{
                                    fontSize:"1rem"
                                },
                                props:{
                                    innerHTML:"close"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                tag:"div",
                class:"pizo-new-realty-contact-item-phone",
                child:[
                    {
                        tag:"span",
                        class:"pizo-new-realty-contact-item-phone-label",
                        props:{
                            innerHTML:"Số điện thoại"
                        }
                    },
                    {
                        tag:"input",
                        class:"pizo-new-realty-contact-item-phone-input",
                        props:{
                            type:"number",
                            value:data.original.phone
                        }
                    },
                    {
                        tag:"selectmenu",
                        class:"pizo-new-realty-contact-item-phone-selectbox",
                        props:{
                            items:[
                                {text:"Còn hoạt động",value:1},
                                {text:"Sai số", value:0},
                                {text:"Gọi lại sau",value:2},
                                {text:"Bỏ qua",value:3},
                                {text:"Khóa máy",value:4}
                            ],
                            value:relate
                        }
                    },
                    {
                        
                    }
                ]
            },
            {
                tag:"div",
                class:"pizo-new-realty-contact-item-note",
                child:[
                    {
                        tag:"span",
                        class:"pizo-new-realty-contact-item-note-label",
                        props:{
                            innerHTML:"Ghi chú"
                        }
                    },
                    {
                        tag:"textarea",
                        class:"pizo-new-realty-contact-item-note-input"
                    }
                ]
            },
        ]
    })
    var name = $('input.pizo-new-realty-contact-item-name-input',temp);
    var type_contact = $('div.pizo-new-realty-contact-item-name-selectbox',temp);
    var phone = $('input.pizo-new-realty-contact-item-phone-input',temp);
    var statusphone = $('div.pizo-new-realty-contact-item-phone-selectbox',temp);
    var note = $('textarea.pizo-new-realty-contact-item-note-input',temp);

    temp.getItemData = function()
    {
        return {
            id:data.original.id===""?undefined:data.original.id,
            name:name.value,
            type_contact:type_contact.value,
            phone:phone.value,
            statusphone:statusphone.value,
            note:note.value
        }
    }

    return temp;
}


NewRealty.prototype.setDataListAccount = function(data){
    if(this.dataAccount ==  undefined)
    this.dataAccount = this.formatDataRowListAccount(data);
    else
    this.dataAccount = this.dataAccount.concat(this.formatDataRowListAccount(data));
    if(this.isLoaded == undefined)
    this.isLoaded = false;
    else
    this.isLoaded = true;
}

NewRealty.prototype.setDataListContact = function(data)
{
    if(this.dataAccount == undefined)
    this.dataAccount  = this.formatDataRowListContact(data);
    else
    this.dataAccount = this.dataAccount.concat(this.formatDataRowListContact(data));
    if(this.isLoaded == undefined)
    this.isLoaded = false;
    else
    this.isLoaded = true;
}

NewRealty.prototype.formatDataRowListAccount = function(data)
{
    var temp = [];
    for(var i = 0;i<data.length;i++){
        temp.push(this.getDataRowListAccount(data[i]));
    }
    return temp;
}

NewRealty.prototype.getDataRowListAccount = function(data){
    var temp = [
        data.username,
        data.name,
        data.phone,
        data.email,
        data.id
    ]
    temp.original = data;
    return temp;
}

NewRealty.prototype.formatDataRowListContact = function(data)
{
    var temp = [];
    for(var i = 0;i<data.length;i++){
        temp.push(this.getDataRowListContact(data[i]));
    }
    return temp;
}

NewRealty.prototype.getDataRowListContact = function(data){
    var temp = [
        "",
        data.name,
        data.phone,
        data.email,
        data.id
    ]
    temp.original = data;
    return temp;
}

NewRealty.prototype.functionChoice = function(event, me, index, parent, data, row)
{
    var self = this;
    console.log(self);
    var arr =  self.getElementsByClassName("choice-list-category");
    if(arr.length!==0)
    arr = arr[0];
    var today  = new Date();
    if(self.clickTime === undefined)
    self.clickTime = 0;
    if(arr == row&&today - self.clickTime< 300){
        self.selfRemove();
        self.resolve({event:event, me:me, index:index, parent:parent, data:data, row:row});
    }
    self.clickTime = today;
    if(arr.length!==0)
    arr.classList.remove("choice-list-category");

    row.classList.add("choice-list-category");
}

NewRealty.prototype.listLink = function(data){
    var self = this;
   
  
    var input = _({
        tag:"input",
        class:"input-search-list",
        props:{
            type:"text",
            placeholder:"Search"
        }
    })
    var container = _({
        tag:"div",
        class:["list-linkChoice-container","absol-single-page-scroller"],
        child:[
            {
                tag:"div",
                class:"js-stools-container-bar",
                child:[
                    {
                        tag:"div",
                        class:["btn-wrapper", "input-append"],
                        child:[
                            input,
                            {
                                tag:"button",
                                class:"pizo-new-realty-contact-tab-button",
                                on:{
                                    click:function(event){
                                        self.modal.selfRemove();
                                        var data = {};
                                        data.original = {
                                            id:"",
                                            name:"",
                                            phone:""
                                        }
                                        self.modal.resolve({event:event, data:data});
                                    }
                                },
                                child:[
                                    {
                                        tag:"i",
                                        class:"material-icons",
                                        style:{
                                            fontSize:"2rem",
                                            margin:"auto"
                                        },
                                        props:{
                                            innerHTML:"add"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    })
    self.modal = _({
        tag:"modal",
        class:"list-linkChoice",
        on:{
            click:function(event){
                var element = event.target;
                
                while(!(element.classList.contains("list-linkChoice")||element.classList.contains("list-linkChoice-container")))
                element = element.parentNode;
                if(element.classList.contains("list-linkChoice")){
                    this.selfRemove();
                    self.modal.reject();
                }
            }
        },
        child:[
            container
        ]
    })

    var header = [
        {value:'Tài khoản',sort:true,style:{minWidth:"unset"} , functionClickAll: self.functionChoice.bind(self.modal)},
        {value:'Họ và tên',sort:true,style:{minWidth:"unset"} , functionClickAll: self.functionChoice.bind(self.modal)},
        {value:'Số điện thoại',style:{minWidth:"90px",width:"90px"} , functionClickAll: self.functionChoice.bind(self.modal)} , 
        {value:'Email',sort:true,style:{minWidth:"unset"} , functionClickAll: self.functionChoice.bind(self.modal)},
        {value:'MS',sort:true,style:{minWidth:"50px",width:"50px"} , functionClickAll: self.functionChoice.bind(self.modal)}, 
    ];
    var mTable = new tableView(header, data, false, false, 0);
    mTable.style.width = "100%";
    container.appendChild(mTable);
    mTable.addInputSearch(input);
    self.modal.promiseSelectList = new Promise(function(resolve,reject){
        self.modal.resolve = resolve;
        self.modal.reject = reject;
    })
    return self.modal;
}

NewRealty.prototype.contactView = function () {
    var self = this;
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-contact",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-contact-tab",
                child:[
                    {
                        tag:"span",
                        class:"pizo-new-realty-contact-tab-label",
                        props:{
                            innerHTML:"Thông tin liên hệ"
                        }
                    },
                    {
                        tag:"button",
                        class:"pizo-new-realty-contact-tab-button",
                        on:{
                            click:function(event){
                                if(self.isLoaded !== true)
                                    return;
                                var x = self.listLink(self.dataAccount);
                                temp.appendChild(x);
                                x.promiseSelectList.then(function(value){
                                    temp.appendChild(self.contactItem(value.data));
                                })
                                
                            }
                        },
                        child:[
                            {
                                tag:"i",
                                class:"material-icons",
                                style:{
                                    fontSize:"1rem"
                                },
                                props:{
                                    innerHTML:"add"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-contact-content",
                child: [
                ]
            }
        ]
    })

    return temp;
}

NewRealty.prototype.juridicalView = function () {
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-juridical",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-juridical-tab",
                props: {
                    innerHTML: "Pháp lý"
                }
            },
            {
                tag: "div",
                class: "pizo-new-realty-juridical-content",
                child: [
                    {
                        tag: "div",
                        class: ""
                    }
                ]
            }
        ]
    })
    return temp;
}

NewRealty.prototype.historyView = function () {
    var self = this;
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-history",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-history-tab",
                props: {
                    innerHTML: "Lịch sử sở hữu"
                }
            }
        ]
    })
    return temp;
}



NewRealty.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

NewRealty.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

NewRealty.prototype.flushDataToView = function () {
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

NewRealty.prototype.start = function () {

}

function removeAccents(str) {
    var AccentsMap = [
        "aàảãáạăằẳẵắặâầẩẫấậ",
        "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
        "dđ", "DĐ",
        "eèẻẽéẹêềểễếệ",
        "EÈẺẼÉẸÊỀỂỄẾỆ",
        "iìỉĩíị",
        "IÌỈĨÍỊ",
        "oòỏõóọôồổỗốộơờởỡớợ",
        "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
        "uùủũúụưừửữứự",
        "UÙỦŨÚỤƯỪỬỮỨỰ",
        "yỳỷỹýỵ",
        "YỲỶỸÝỴ"
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
        var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
        var char = AccentsMap[i][0];
        str = str.replace(re, char);
    }
    str = str.replace(" ", "");
    return str;
}

export default NewRealty;