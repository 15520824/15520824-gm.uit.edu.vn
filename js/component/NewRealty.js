import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import '../../css/NewRealty.css';
import '../../css/imagesilder.css';
import { locationView,MapView } from "./MapView";
import { descViewImagePreview } from './ModuleImage'
import { unit_Long, unit_Zone, deleteQuestion } from './ModuleView';
import {formatNumber,reFormatNumber,formatFit,isEqual} from './FormatFunction'
import R from '../R';
import Fcore from '../dom/Fcore';
import moduleDatabase from './ModuleDatabase';
import NewContact from './NewContact';
import NewAccount from '../component/NewAccount';

import xmlModalDragManyFiles from './modal_drag_drop_manyfiles';

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
                                        
                                        if(!isEqual(self.getDataSave(),self.data))
                                        {
                                            var deleteItem = deleteQuestion("Lưu thay đổi", "Bạn muốn đóng (tất cả những chỉnh sửa sẽ không được lưu lại)?");
                                            self.$view.addChild(deleteItem);
                                            deleteItem.promiseComfirm.then(function () {
                                                self.rejectDB(self.getDataSave());
                                                self.$view.selfRemove();
                                                var arr = self.parent.body.getAllChild();
                                                self.parent.body.activeFrame(arr[arr.length - 1]);
                                            })
                                        }
                                        else
                                        {
                                            self.rejectDB(self.getDataSave());
                                            self.$view.selfRemove();
                                            var arr = self.parent.body.getAllChild();
                                            self.parent.body.activeFrame(arr[arr.length - 1]);
                                        }
                                        
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
                                        self.data = self.getDataSave();
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
                                        self.data = self.getDataSave();
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
    setTimeout(function(){
        self.data = self.getDataSave();
    },100)
    return this.$view;
}

NewRealty.prototype.descView = function () {
    this.checkAddress = moduleDatabase.getModule("addresses").getLibary("id");
    this.checkStreet = moduleDatabase.getModule("streets").getLibary("id");
    this.checkWard = moduleDatabase.getModule("wards").getLibary("id");
    this.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");
    this.checkState = moduleDatabase.getModule("states").getLibary("id");

    var self = this;
    moduleDatabase.getModule("users").load().then(function(value)
    {
        self.checkUser = moduleDatabase.getModule("users").getLibary("phone");
        self.checkUserID = moduleDatabase.getModule("users").getLibary("id");
    })

    moduleDatabase.getModule("contacts").load().then(function(value)
    {
        self.checkContact = moduleDatabase.getModule("contacts").getLibary("phone");
        self.checkContactID = moduleDatabase.getModule("contacts").getLibary("id");
    })
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
                            self.convenientView(),
                            self.contactView,
                            self.imageCurrentStaus()
                        ]
                    },
                    {
                        tag: "div",
                        class: "pizo-new-realty-desc-infomation-cell",
                        child: [
                            self.juridicalView(),
                            self.historyView(),
                            self.imageJuridical(),
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

NewRealty.prototype.imageJuridical = function()
{
    var result = Object.assign({}, xmlModalDragManyFiles);
    result.enableClick = true;
    
    result.setFormatData(function(data){
        return {
            avatar:"https://4.bp.blogspot.com/-AYOvATaN5wQ/V5sRt4Kim_I/AAAAAAAAF8s/QWR5ZHQ8N38ByHRLP2nOCJySfMmJur5sACLcB/s280/sieu-nhan-cuu-the-gioi.jpg",
            userName:"Bùi Phạm Minh Thi",
            src:data.src,
            date:data.created,
            note:""
    }
    })
    var container = result.containGetImage();
    result.setBackWhite();
    result.createEvent();

    var temp = _({
        tag: "div",
        class: "pizo-new-realty-image",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-image-tab",
                props: {
                    innerHTML: "Hình ảnh pháp lý"
                }
            },
            {
                tag: "div",
                class: "pizo-new-realty-image-content",
                child: [
                    container
                ]
            }
        ]
    })
    this.viewJuridical = result;
    var arr = [];
    var first = "";
    if(this.data!==undefined)
    {
        for(var i = 0;i<this.data.original.image.length;i++)
        {
            if(first!=="")
            arr.push(first);
            arr.push({id:this.data.original.image[i]})
            if(first=="")
            {
                
                first = "||";
            }
        }
       
    }
    if(arr.length>0)
    moduleDatabase.getModule("image").load({WHERE:arr}).then(function(values){
        console.log(values)
        for(var i = 0;i<values.length;i++)
        if(values[i].type == 0)
        result.addFile(values[i],"https://lab.daithangminh.vn/home_co/pizo/assets/upload/");
    })
    return temp;
}

NewRealty.prototype.imageCurrentStaus = function()
{
    var result = Object.assign({}, xmlModalDragManyFiles);
    result.enableClick = true;
    result.enableCheckBox = true;
    result.setFormatData(function(data){
        return {
            avatar:"https://4.bp.blogspot.com/-AYOvATaN5wQ/V5sRt4Kim_I/AAAAAAAAF8s/QWR5ZHQ8N38ByHRLP2nOCJySfMmJur5sACLcB/s280/sieu-nhan-cuu-the-gioi.jpg",
            userName:"Bùi Phạm Minh Thi",
            src:data.src,
            date:data.created,
            note:""
    }
    })
    var container = result.containGetImage();
    result.createEvent();
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-image",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-image-tab",
                props: {
                    innerHTML: "Hình ảnh hiện trạng"
                }
            },
            {
                tag: "div",
                class: "pizo-new-realty-image-content",
                child: [
                    container
                ]
            }
        ]
    })
    this.viewCurrentStaus = result;
    var arr = [];
    var first = "";
    if(this.data!==undefined)
    {
        for(var i = 0;i<this.data.original.image.length;i++)
        {
            if(first!=="")
            arr.push(first);
            arr.push({id:this.data.original.image[i]});
            if(first=="")
            {
                
                first = "||";
            }
        }
       
    }
    if(arr.length>0)
    moduleDatabase.getModule("image").load({WHERE:arr}).then(function(values){
        for(var i = 0;i<values.length;i++)
        if(values[i].type == 1)
        result.addFile(values[i],"https://lab.daithangminh.vn/home_co/pizo/assets/upload/");
    })
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

NewRealty.prototype.itemAdress = function(addressid = 0,lat,lng)
{
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
                            childRemove.selfRemove();
                            if(temp.data.lat!=undefined&&temp.data.lng!=undefined)
                            {
                                self.containerMap.addMoveMarker([temp.data.lat,temp.data.lng],false)
                            }
                        },temp.data)
                        childNode.addLatLng();
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

    if(addressid!=0)
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
            lng:lng,
            lat:lat,
        }
    }
    return temp;
}

NewRealty.prototype.itemAdressOld = function(addressid = 0)
{
    var self = this;
    var text = _({ text: "Địa chỉ cũ" });
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
    if(addressid!=0)
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
            state:this.checkState[this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].stateid].name+"_"+this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].stateid
        }
    }
    return temp;
}

// NewRealty.prototype.itemAdress = function (addressid = 0) {


//     var self = this;
//     var text = _({ text: "Địa chỉ" });
//     var important = _({
//         tag: "span",
//         class: "pizo-new-realty-location-detail-row-label-important",
//         props: {
//             innerHTML: "*"
//         }
//     });
//     var temp = _({
//         tag: "div",
//         class: ["pizo-new-realty-desc-detail-row", "adressItemCheck"],
//         child: [
//             {
//                 tag: "span",
//                 class: "pizo-new-realty-desc-detail-1-row-label",
//                 child: [
//                     text,
//                     important
//                 ]

//             },
//             {
//                 tag: "input",
//                 class: ["pizo-new-realty-desc-detail-1-row-input"],
//                 on: {
//                     click: function (event) {
//                         this.blur();
//                         var selfElement = this;
//                         var childNode = locationView(function (value) {
//                             selfElement.value = value.input.value;
//                             temp.data = childNode.getDataCurrent();
//                             temp.selfRemoveChild(value.input.value, childNode);
//                             childRemove.selfRemove();

//                         },temp.data)
//                         var childRemove = _({
//                             tag: "modal",
//                             on: {
//                                 click: function (event) {
//                                     var target = event.target;
//                                     while (target !== childNode && target !== childRemove && target !== document.body)
//                                         target = target.parentNode;
//                                     if (target === childRemove)
//                                         childRemove.selfRemove();
//                                 }
//                             },
//                             child: [
//                                 childNode
//                             ]
//                         })
//                         temp.appendChild(childRemove)
//                     }
//                 }
//             }
//         ]
//     })
//     temp.label = text;
//     temp.important = important;
//     temp.updateIndex = function (index) {
//         temp.index = index;
//         if (index == 0)
//         {
//             index = "";
//         }else
//         temp.important.style.display = "none";
            
//         temp.label.data = "Địa chỉ " + index;
//     }
//     temp.parentUpdateIndex = function () {
//         var k = 0;
//         for (var i = 0; i < temp.parentNode.childNodes.length; i++) {
//             if (!temp.parentNode.childNodes[i].classList.contains("adressItemCheck"))
//                 return;
//             temp.parentNode.childNodes[i].updateIndex(k++);
//         }
//     }
//     temp.selfRemoveChild = function (value,childNode) {
//         temp.value = value;
    
//         var next = temp;
//         while (next.nextSibling!==null)
//             next = next.nextSibling;
//         if (value === "") {
            
//             switch (temp.index) {
//                 case undefined:
//                 case 0:
//                     if (temp.nextSibling.classList.contains("adressItemCheck")&&(temp.nextSibling.value === "" || temp.nextSibling.value === undefined)) {
//                         temp.nextSibling.selfRemove();
//                     }
//                     var containerMap = _({
//                         tag: "div"
//                     })
//                     self.containerMap.parentNode.replaceChild(containerMap, self.containerMap);
//                     self.containerMap = containerMap;
//                     break;
//                 case 1:
//                 case 2:
//                     if (next !== temp){
//                         if (next.value === "" || next.value === undefined) {
//                             var prev = temp.previousSibling;
//                             temp.selfRemove();
//                             prev.parentUpdateIndex();
    
//                         } else {
//                             temp.parentNode.insertBefore(temp, next.nextSibling);
//                             temp.parentUpdateIndex();
//                         }
//                     }
//                     break;
//                 case 3:
//                     break;

//             }
//             return true;
//         } else {
//             switch(temp.index)
//             {
//                 case undefined:
//                 case 0:
//                     if (childNode.map.currentMarker !== undefined) {
//                         childNode.map.currentMarker.setDraggable(false);
//                         var latLng = childNode.map.currentMarker.getPosition();
//                         childNode.map.map.setCenter(latLng);
//                         self.containerMap.parentNode.replaceChild(childNode.map, self.containerMap);
//                         self.containerMap = childNode.map;
//                     }
//                     if(next === temp)
//                     {
//                         temp.parentNode.insertBefore(self.itemAdress(), temp.nextSibling);
//                         temp.parentUpdateIndex();
//                     }
//                     break;
//                 case 1:
//                 case 2:
//                     if(next === temp)
//                     {
//                         temp.parentNode.insertBefore(self.itemAdress(), temp.nextSibling);
//                         temp.parentUpdateIndex();
//                     }
//                     break;
//             }
            
//             return false;
//         }
        
//     }
//     this.inputAdress = $('input.pizo-new-realty-desc-detail-1-row-input',temp);
//     if(addressid!==0)
//     {
//         var number = this.checkAddress[addressid].addressnumber;
//         var street = this.checkStreet[this.checkAddress[addressid].streetid].name;
//         var ward = this.checkWard[this.checkAddress[addressid].wardid].name;
//         var district = this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].name;
//         var state = this.checkState[this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].stateid].name;
//         $("input.pizo-new-realty-desc-detail-1-row-input",temp).value = number+" "+street+", "+ward+", "+district+", "+state;
//         temp.data = {
//             id:addressid,
//             number:this.checkAddress[addressid].addressnumber,
//             street:this.checkStreet[this.checkAddress[addressid].streetid].name+"_"+this.checkAddress[addressid].streetid,
//             ward:this.checkWard[this.checkAddress[addressid].wardid].name+"_"+this.checkAddress[addressid].wardid,
//             district:this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].name+"_"+this.checkWard[this.checkAddress[addressid].wardid].districtid,
//             state:this.checkState[this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].stateid].name+"_"+this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].stateid,
//             lng:this.checkAddress[addressid].lng,
//             lat:this.checkAddress[addressid].lat,
//         }
//     }
//     return temp;
// }

NewRealty.prototype.descViewdetail = function () {
    var self = this;
    var containerAdress = _({
        tag:"div",
        style:{
            marginBottom:"10px"
        }
    });
    if(this.data!==undefined)
    {
        var addressCurrent = this.itemAdress(this.data.original.addressid,this.data.original.lat,this.data.original.lng)
        containerAdress.appendChild(addressCurrent);
        var map = new MapView();
        map.activePlanningMap();
        map.addMoveMarker([this.data.original.lat,this.data.original.lng],false);
        map.currentMarker.setDraggable(false);
        this.containerMap.parentNode.replaceChild(map, this.containerMap);
        this.containerMap = map;
        var addressOld = this.itemAdressOld(this.data.original.addressid_old)
        containerAdress.appendChild(addressOld);
    }else
    {
        
        var addressCurrent = this.itemAdress();
        containerAdress.appendChild(addressCurrent);
        var map = new MapView();
        map.activePlanningMap();
        this.containerMap.parentNode.replaceChild(map, this.containerMap);
        this.containerMap = map;
        var addressOld = this.itemAdressOld();
        containerAdress.appendChild(addressOld);
    }

   
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
    
    this.addressCurrent = addressCurrent;
    this.addressOld = addressOld;

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
    var self = this;

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
                                                        on:{
                                                            change:function(event)
                                                            {
                                                                if(this.value===3)
                                                                self.advanceDetruct.style.display = "";
                                                                else
                                                                self.advanceDetruct.style.display = "none";
                                                                if(this.value>=2)
                                                                self.simpleDetruct.style.display = "";
                                                                else
                                                                self.simpleDetruct.style.display = "none";
                                                            }
                                                        },
                                                        props: {
                                                            items: [
                                                               {text:"Chưa xác định",value:0},
                                                               {text:"Đất trống",value:1},
                                                               {text:"Cấp 4",value:2},
                                                               {text:"Sẳn *",value:3},
                                                            ]
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
                    {
                        tag: "div",
                        class: ["pizo-new-realty-dectruct-content-area","pizo-new-realty-dectruct-content-area-simple"],
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
                                tag:"div",
                                class:"pizo-new-realty-dectruct-content-area-advance",
                                child:[
                                    {
                                        tag: "div",
                                        class: ["pizo-new-realty-dectruct-content-area-size",],
                                        child: [
                                            {
                                                tag: "div",
                                                class: ["pizo-new-realty-dectruct-content-area-size-zone"],
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
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-selectbox",
                                        child:[
                                            {
                                                tag:"div",
                                                class:"pizo-new-realty-dectruct-content-area-size-zone",
                                                child:[
                                                    {
                                                        tag:"div",
                                                        class:"pizo-new-realty-desc-detail-row",
                                                        child:[
                                                            {
                                                                tag:"div",
                                                                class:"pizo-new-realty-dectruct-content-area-selectbox-child",
                                                                child:[
                                                                    {
                                                                        tag:"span",
                                                                        props:{
                                                                            innerHTML:"Lửng"
                                                                        }
                                                                    },
                                                                    {
                                                                        tag:"checkbox",
                                                                        class:"pizo-new-realty-dectruct-content-area-selectbox-child-1"
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                tag:"div",
                                                                class:"pizo-new-realty-dectruct-content-area-selectbox-child",
                                                                child:[
                                                                    {
                                                                        tag:"span",
                                                                        props:{
                                                                            innerHTML:"Sân thượng"
                                                                        }
                                                                    },
                                                                    {
                                                                        tag:"checkbox",
                                                                        class:"pizo-new-realty-dectruct-content-area-selectbox-child-2"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                tag:"div",
                                                class:"pizo-new-realty-dectruct-content-area-size-zone",
                                                child:[
                                                    {
                                                        tag:"div",
                                                        class:"pizo-new-realty-desc-detail-row",
                                                        child:[
                                                            {
                                                                tag:"div",
                                                                class:"pizo-new-realty-dectruct-content-area-selectbox-child",
                                                                child:[
                                                                    {
                                                                        tag:"span",
                                                                        props:{
                                                                            innerHTML:"Ban công"
                                                                        }
                                                                    },
                                                                    {
                                                                        tag:"checkbox",
                                                                        class:"pizo-new-realty-dectruct-content-area-selectbox-child-3"
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                tag:"div",
                                                                class:"pizo-new-realty-dectruct-content-area-selectbox-child",
                                                                child:[
                                                                    {
                                                                        tag:"span",
                                                                        props:{
                                                                            innerHTML:"Thang máy"
                                                                        }
                                                                    },
                                                                    {
                                                                        tag:"checkbox",
                                                                        class:"pizo-new-realty-dectruct-content-area-selectbox-child-4"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
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
                        class: "pizo-new-realty-dectruct-content-area-right",
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

    this.advanceDetruct = $("div.pizo-new-realty-dectruct-content-area-advance",temp);
    this.simpleDetruct = $("div.pizo-new-realty-dectruct-content-area-simple",temp);

    this.advanceDetruct1 = $("div.pizo-new-realty-dectruct-content-area-selectbox-child-1",temp);
    this.advanceDetruct2 = $("div.pizo-new-realty-dectruct-content-area-selectbox-child-2",temp);
    this.advanceDetruct3 = $("div.pizo-new-realty-dectruct-content-area-selectbox-child-3",temp);
    this.advanceDetruct4 = $("div.pizo-new-realty-dectruct-content-area-selectbox-child-4",temp);

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
        this.structure.emit("change");
        this.inputName.value = original.name;
        var checkStatus = parseInt(original.salestatus);
        this.inputLease.checked = parseInt(checkStatus/10)==1?true:false;
        this.inputSell.checked = parseInt(checkStatus%10)==1?true:false;
        this.inputContent.value = original.content;
        this.inputFit.values = formatFit(parseInt(original.fit));
        this.inputPrice.emit("change");
        var advanceDetruct = this.data.original.advancedetruct;
        this.advanceDetruct1.checked = advanceDetruct%10?true:false;
        advanceDetruct = parseInt(advanceDetruct/10);
        this.advanceDetruct2.checked = advanceDetruct%10?true:false;
        advanceDetruct = parseInt(advanceDetruct/10);
        this.advanceDetruct3.checked = advanceDetruct%10?true:false;
        advanceDetruct = parseInt(advanceDetruct/10);
        this.advanceDetruct4.checked = advanceDetruct%10==1?true:false;
    }
    return temp;
}

NewRealty.prototype.getDataSave = function(){
    var fitUpdate = 0;
    if(this.inputFit.values.length!==0)
    fitUpdate = this.inputFit.values.reduce(function(a, b) { return a + b; });
    var advanceDetruct = 0;
    advanceDetruct += this.advanceDetruct1.checked?1:0;
    advanceDetruct += this.advanceDetruct2.checked?10:0;
    advanceDetruct += this.advanceDetruct3.checked?100:0;
    advanceDetruct += this.advanceDetruct4.checked?1000:0;

    var image = [];
    var arr = this.viewJuridical.getFile();
    for(var i = 0;i<arr.length;i++)
    {
        if(typeof arr[i] == "string")
        {
            image.push({src:arr[i],type:0});
        }else
        {
            image.push({src:arr[i].id,type:0});
        }
    }
    var thumnail = this.viewCurrentStaus.getImportTant();
    console.log(thumnail)
    arr = this.viewCurrentStaus.getFile();
    for(var i = 0;i<arr.length;i++)
    {
        if(typeof arr[i] == "string")
        {
            var src = arr[i];
        }else
        {
            var src = arr[i].id;
        }
        if(i == thumnail)
        image.push({src:src,type:1,thumnail:1});
        else
        image.push({src:src,type:1,thumnail:0});
    }
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
        advancedetruct:advanceDetruct,
        juridical:this.juridical.value,
        image:image,
        // important:this.viewCurrentStaus.getImportTant()
    }
    var arr = [];
    for(var i = 0;i<this.containerEquipment.childNodes.length;i++)
    {
        arr.push(this.containerEquipment.childNodes[i].getData());
    }
    temp.equipment = arr;

    var contact=[];
    for(var i = 0;i<this.containerContact.childNodes.length;i++)
    {
        contact.push(this.containerContact.childNodes[i].getData());
    }
    temp.contact = contact;
    
    if(this.addressCurrent.data!==undefined){
        var address = {};
        var data = this.addressCurrent.data;

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

        temp.lat = data.lat;
        temp.lng = data.lng;

        temp.addressid = address;
    }

    if(this.addressOld.data!==undefined){
        var address = {};
        var data = this.addressOld.data;

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
        
        temp.addressid_old = address;
    }

    if(this.data!==undefined&&this.data.original!==undefined)
    temp.id = this.data.original.id;
    else
    temp.id = this.data.id;
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
    var self = this;
    var data = moduleDatabase.getModule("equipments").data;
    var arr = [];
    for(var i = 0;i<data.length;i++)
    {
        if(data[i].available===0)
        continue;
        arr.push({text:data[i].name,value:data[i].id,data:data[i]})
    }
    var container = _({
        tag:"div",
        class:"pizo-new-realty-dectruct-content-area-size"
    })
    var equipment = _({
        tag:"selectbox",
        style:{
            width:"100%"
        },
        props:{
            items:arr,
            enableSearch: true
        },
        on:{
            add:function(event)
            {
                switch(parseInt(event.itemData.data.type))
                {
                    case 0:
                        container.appendChild(self.itemCount(event.itemData.data));
                        break;
                    case 1:
                        container.appendChild(self.itemDisplayNone(event.itemData.data));
                        break;
                }
            },
            remove:function(event)
            {
                for(var i = 0;i<container.childNodes.length;i++)
                {
                    if(container.childNodes[i].equipmentid == event.itemData.data.id)
                    {
                        container.childNodes[i].selfRemove();
                        break;
                    }
                }
            }
        }
    });

    if(this.data!==undefined)
    {
        var value = [];
        var temp;
        var libary = moduleDatabase.getModule("equipments").getLibary("id");
        for(var i = 0;i<this.data.original.equipment.length;i++)
        {
            temp = libary[this.data.original.equipment[i].equipmentid];
            temp.content = this.data.original.equipment[i].content;
            value.push(this.data.original.equipment[i].equipmentid);
            switch(parseInt(temp.type))
            {
                case 0:
                    if(temp.available==1)
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
    }
    
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

NewRealty.prototype.itemCount = function(data)
{
    var input = _({
        tag: "input",
        class: ["pizo-new-realty-dectruct-content-area-floor", "pizo-new-realty-dectruct-input"],
        attr: {
            type: "number",
            min: 0,
            step: 1
        },
        props:{
            value:1
        }
    });
    if(data.content!==undefined)
    {
        input.value = data.content;
    }
    var temp = _({
        tag: "div",
        class: ["pizo-new-realty-dectruct-content-area-size-zone-all"],
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-desc-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-dectruct-content-area-floor-label",
                        props: {
                            innerHTML: data.name,
                        },
                    },
                    input
                ]
            }
        ]
    });
    temp.equipmentid = data.id;
    temp.getData = function()
    {
        var result = {
            equipmentid:data.id,
            content:input.value
        }
        return result;
    }
    return temp;
}

NewRealty.prototype.itemDisplayNone = function(data)
{
    var temp = _({
        tag:"div",
        style:{
            display:"none"
        }
    })
    temp.equipmentid = data.id;
    temp.getData = function()
    {
        var result = {
            equipmentid:data.id,
            content:data.content
        }
        return result;
    }
    return temp;
}

NewRealty.prototype.editContact = function(node,data)
{
    var self = this;
    var mNewContact = new NewContact({original:data});
    mNewContact.attach(self.parent);
    var frameview = mNewContact.getView();
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDBContact(mNewContact,data,node);
}

NewRealty.prototype.editDBContact = function(mNewContact,data,node){
    var self = this;
    mNewContact.promiseEditDB.then(function(value){
        if(value.id===undefined)
        moduleDatabase.getModule("users").add(value).then(function(result){
            self.editViewAccount(result,node);
        })
        else
        moduleDatabase.getModule("contacts").update(value).then(function(result){
            self.editViewContact(result,node);
        })
        mNewContact.promiseEditDB = undefined;
        setTimeout(function(){
        if(mNewContact.promiseEditDB!==undefined)
            self.editDBContact(mNewContact,data);
        },10);
    })
}

NewRealty.prototype.editViewContact = function(value,node){
    node.setInformation(value);
}


NewRealty.prototype.editAccount = function(node,data)
{
    var self = this;
    moduleDatabase.getModule("positions").load().then(function(value){
        var mNewAccount = new NewAccount({original:data});
        mNewAccount.attach(self.parent);
        var frameview = mNewAccount.getView(moduleDatabase.getModule("positions").getList("name","id"));
        self.parent.body.addChild(frameview);
        self.parent.body.activeFrame(frameview);
        self.editDBAccount(mNewAccount,data,node);
    })
}

NewRealty.prototype.editDBAccount = function(mNewAccount,data,node){
    var self = this;
    mNewAccount.promiseEditDB.then(function(value){
        moduleDatabase.getModule("users").update(value).then(function(result){
            self.editViewAccount(result,node);
        })
        mNewAccount.promiseEditDB = undefined;
        setTimeout(function(){
        if(mNewAccount.promiseEditDB!==undefined)
            self.editDBAccount(mNewAccount,data,parent,index);
        },10);
    })
}

NewRealty.prototype.editViewAccount = function(value,node){
    node.setInformation(value);
}

NewRealty.prototype.contactItem = function(data){
  
    var name,typecontact,phone,statusphone,note;
    var self = this;
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
                        class:"pizo-new-realty-contact-item-setting",
                        on:{
                            click:function(event){
                                var tempData = temp.getData();
                                if(tempData.username!==undefined)
                                self.editAccount(temp,tempData);
                                else
                                self.editContact(temp,tempData);
                            }
                        },
                        child:[
                            {
                                tag:"i",
                                class:"material-icons",
                                style:{
                                    fontSize:"1rem",
                                    verticalAlign: "middle"
                                },
                                props:{
                                    innerHTML:"settings"
                                }
                            }
                        ]
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
                                    fontSize:"1rem",
                                    verticalAlign: "middle"
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
                            type:"number"
                        },
                        on:{
                            change:function(event)
                            {
                                if(self.checkUser===undefined)
                                {
                                    var element = this;
                                    moduleDatabase.getModule("users").load().then(function(){
                                        setTimeout(function(){
                                            element.emit("change");
                                        },10)
                                      
                                    })
                                    return;
                                }
                                if(self.checkContact===undefined)
                                {
                                    var element = this;
                                    moduleDatabase.getModule("contacts").load().then(function(){
                                        setTimeout(function(){
                                            element.emit("change");
                                        },10)
                                    })
                                    return;
                                }
                                if(self.checkUser[this.value]!==undefined||self.checkContact[this.value]!==undefined)
                                {
                                    if(self.checkUser[this.value]!==undefined){
                                        var tempValue = self.checkUser[this.value];
                                        temp.setInformation(tempValue);
                                    }
                                    else
                                    {
                                        var tempValue = self.checkContact[this.value];
                                        temp.setInformation(tempValue);
                                    }
                                }else
                                {
                                    temp.setOpenForm();
                                }
                            }
                        }
                    },
                    {
                        tag:"selectmenu",
                        class:"pizo-new-realty-contact-item-phone-selectbox",
                        style:{
                            width: "190px"
                        },
                        props:{
                            items:[
                                {text:"Còn hoạt động",value:1},
                                {text:"Sai số", value:0},
                                {text:"Gọi lại sau",value:2},
                                {text:"Bỏ qua",value:3},
                                {text:"Khóa máy",value:4}
                            ]
                        }
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
    var typecontact = $('div.pizo-new-realty-contact-item-name-selectbox',temp);
    var phone = $('input.pizo-new-realty-contact-item-phone-input',temp);
    var statusphone = $('div.pizo-new-realty-contact-item-phone-selectbox',temp);
    var note = $('textarea.pizo-new-realty-contact-item-note-input',temp);
    phone.checkContact = function(data)
    {
        if(self.checkUserID===undefined)
        {
            var element = this;
            moduleDatabase.getModule("users").load().then(function(){
                setTimeout(function(){
                    element.checkContact(data);
                },10)
            })
            return;
        }
        if(self.checkContactID===undefined)
        {
            var element = this;
            moduleDatabase.getModule("contacts").load().then(function(){
                setTimeout(function(){
                    element.checkContact(data);
                },10)
            })
            return;
        }
        if(data.contactid!==undefined&&data.contactid!==0)
        {
            temp.setInformation(self.checkContactID[data.contactid]);
        }else
        if(data.userid!==undefined&&data.userid!==0)
        {
            temp.setInformation(self.checkUserID[data.userid]);
        }else
        {
            temp.setInformation(data);
        }
    }
    temp.setInformation = function(data)
    {
        if(data === undefined)
        {
            temp.selfRemove();
            return;
        }
        temp.data = data;
        if(data.statusphone === undefined)
            statusphone.value = 1
        else
            statusphone.value = data.statusphone;
        phone.value = data.phone;
        name.value = data.name;
        name.setAttribute("disabled","");
        statusphone.style.pointerEvents = "none";
        statusphone.style.backgroundColor = "#f3f3f3";
    }
    temp.setOpenForm = function(data)
    {
        temp.data = data;
        statusphone.value = 1;
        name.removeAttribute("disabled");
        statusphone.style.pointerEvents = "unset";
        statusphone.style.backgroundColor = "unset";
    }
    temp.getData = function()
    {
        if(temp.data!==undefined)
        {
            temp.data.typecontact = typecontact.value;
            temp.data.note = note.value;
            return temp.data;
        }else
        {
            return {
                name:name.value,
                statusphone:statusphone.value,
                phone:phone.value,
                typecontact : typecontact.value,
                note:note.value
            }
        }
    }

    if(data!==undefined)
    {
        phone.checkContact(data);
        typecontact.value = data.typecontact;
        note.value = data.note;
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

NewRealty.prototype.contactView = function () {
    var self = this;
    var containerContact = _({
        tag: "div",
        class: "pizo-new-realty-contact-content",
        child: [
        ]
    });
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
                                containerContact.appendChild(self.contactItem());
                                
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
            containerContact
        ]
    })
    if(this.data!==undefined)
    {
        for(var i = 0 ;i<this.data.original.contact.length;i++)
        {
            containerContact.appendChild(this.contactItem(this.data.original.contact[i]));
        }
    }
    this.containerContact = containerContact;

    return temp;
}

NewRealty.prototype.juridicalView = function () {
    var arr = moduleDatabase.getModule("juridicals").getList("name","id");
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
                        class: "pizo-new-realty-dectruct-content-area-right",
                        child: [
                            {
                                tag: "span",
                                class: "pizo-new-realty-detruct-content-area-label",
                                props: {
                                    innerHTML: "Tình trạng"
                                },
                            },
                            {
                                tag: "selectmenu",
                                style:{
                                    textAlign: "left"
                                },
                                class: ["pizo-new-realty-dectruct-content-area-fit", "pizo-new-realty-dectruct-input"],
                                props: {
                                    items:arr
                                }
                            }
                        ]
                    },
                ]
            }
        ]
    })
    this.juridical = $('div.pizo-new-realty-dectruct-content-area-fit.pizo-new-realty-dectruct-input',temp);
    if(this.data!==undefined)
    {
        this.juridical.value = this.data.original.juridical;
    }
    return temp;
}

NewRealty.prototype.historyView = function () {
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