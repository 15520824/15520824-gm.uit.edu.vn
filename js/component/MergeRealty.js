import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/MergeRealty.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import MergeTool from 'mpot-merge-tool';
import moduleDatabase from '../component/ModuleDatabase';
import { MapView } from "./MapView";
import NewAccount from '../component/NewAccount';

var _ = Fcore._;
var $ = Fcore.$;

function MergeRealty(data) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.data = data;
}

MergeRealty.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(MergeRealty.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
MergeRealty.prototype.constructor = MergeRealty;

MergeRealty.prototype.getDataSave = function() {
    
    return {
        id:this.data===undefined?undefined:this.data.original.id,
        name:this.name.value,
        type:this.type.value,
        districtid:this.district.value
    }
}

MergeRealty.prototype.createPromise = function()
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

MergeRealty.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
    this.$view = _({
        tag: 'singlepage',
        class: "pizo-list-realty",
        child: [
            {
                class: 'absol-single-page-header',
                child: [
                    {
                        tag: "span",
                        class: "pizo-body-title-left",
                        props: {
                            innerHTML: "Gộp bất động sản"
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
    });

    var myTool = new MergeTool.MPOTMergeTool();
    var element = new MapView();
    element.activePlanningMap();
    var toolView = myTool.getView();
    var itemsAddress = [];
    var itemsAddressOld = [];
    var itemData;
    var valueAddress,valueAddressOld;
    var valueName,itemName = [];
    var valueContent,itemContent = [];
    var valueWidth,itemWidth = [],sumWidth = 0;
    var valueHeight,itemHeight = [],sumHeight = 0;
    var valueAcreage,itemAcreage = [],sumAcreage = 0;
    var valueLandarea,itemLandarea = [],sumLandarea = 0;
    var valueFloorarea,itemFloorarea = [],sumFloorarea = 0;
    var valueDirection,itemDirection = [];
    var checkDirection = {
        0:"Chưa xác định",
        6:"Đông",
        4:"Tây",
        2:"Nam",
        8:"Bắc",
        9:"Đông Bắc",
        3:"Đông Nam",
        7:"Tây Bắc",
        1:"Tây Nam"
    }
    var valueType,itemType = [];
    var checkType =  moduleDatabase.getModule("type_activehouses").getLibary("id");
    var number,street,ward,district,state,fullAddress;
    var checkAddress = [];
    var valueRoadWidth,itemRoadWidth = [],sumRoadWidth = 0;

    var itemEquipments = [],itemContact = [];

    this.checkAddress = moduleDatabase.getModule("addresses").getLibary("id");
    this.checkStreet = moduleDatabase.getModule("streets").getLibary("id");
    this.checkWard = moduleDatabase.getModule("wards").getLibary("id");
    this.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");
    this.checkState = moduleDatabase.getModule("states").getLibary("id");
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
    
    var valueStructure,itemStructure = [] , valueSimpleStructure;
    for(var i = 0;i<this.data.length;i++)
    {
        //Địa chỉ hiện tại
        itemData = this.data[i].original;
        if(itemData.addressid!==0)
        {
            number = this.checkAddress[itemData.addressid].addressnumber;
            street = this.checkStreet[this.checkAddress[itemData.addressid].streetid].name;
            ward = this.checkWard[this.checkAddress[itemData.addressid].wardid].name;
            district = this.checkDistrict[this.checkWard[this.checkAddress[itemData.addressid].wardid].districtid].name;
            state = this.checkState[this.checkDistrict[this.checkWard[this.checkAddress[itemData.addressid].wardid].districtid].stateid].name;
            fullAddress = number+" "+street+", "+ward+", "+district+", "+state;
            itemsAddress.push(fullAddress);
            checkAddress[fullAddress] = [itemData.lat,itemData.lng];
            checkAddress[fullAddress].data = itemData;
            if(valueAddress===undefined)
            {
                valueAddress = fullAddress;
                element.addMoveMarker(checkAddress[fullAddress])
            }
        }

        //Địa chỉ cũ
        if(itemData.addressid_old!=0)
        {
            number = this.checkAddress[itemData.addressid_old].addressnumber;
            street = this.checkStreet[this.checkAddress[itemData.addressid_old].streetid].name;
            ward = this.checkWard[this.checkAddress[itemData.addressid_old].wardid].name;
            district = this.checkDistrict[this.checkWard[this.checkAddress[itemData.addressid_old].wardid].districtid].name;
            state = this.checkState[this.checkDistrict[this.checkWard[this.checkAddress[itemData.addressid_old].wardid].districtid].stateid].name;
            fullAddress = number+" "+street+", "+ward+", "+district+", "+state;
            itemsAddressOld.push(fullAddress);
            if(valueAddressOld===undefined)
            valueAddressOld = fullAddress;
        }

        itemName.push(itemData.name);
        if(valueName===undefined)
        valueName = itemData.name;

        itemContent.push(itemData.content);
        if(valueContent===undefined)
        valueContent = itemData.content;

        sumWidth += parseFloat(itemData.width);
        itemWidth.push(itemData.width);
        if(valueWidth===undefined)
        valueWidth = itemData.width;

        sumHeight += parseFloat(itemData.height);
        itemHeight.push(itemData.height);
        if(valueHeight===undefined)
        valueHeight = itemData.height;

        sumAcreage += parseFloat(itemData.acreage);
        itemAcreage.push(itemData.acreage);
        if(valueAcreage===undefined)
        valueAcreage = itemData.acreage;

        sumLandarea += parseFloat(itemData.landarea);
        itemLandarea.push(itemData.landarea);
        if(valueLandarea===undefined)
        valueLandarea = itemData.landarea;

        sumFloorarea += parseFloat(itemData.floorarea);
        itemFloorarea.push(itemData.floorarea);
        if(valueFloorarea===undefined)
        valueFloorarea = itemData.floorarea;

        var advanceDetruct = itemData.advancedetruct;
        var advanceDetruct1 = advanceDetruct%10?true:false;
        advanceDetruct = parseInt(advanceDetruct/10);
        var advanceDetruct2 = advanceDetruct%10?true:false;
        advanceDetruct = parseInt(advanceDetruct/10);
        var  advanceDetruct3 = advanceDetruct%10?true:false;
        advanceDetruct = parseInt(advanceDetruct/10);
        var advanceDetruct4 =   advanceDetruct%10?true:false;

        advanceDetruct = _({
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
                                                value:itemData.floor
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
                                                value:itemData.basement
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
                                                    class:"pizo-new-realty-dectruct-content-area-selectbox-child-1",
                                                    props:{
                                                        checked:advanceDetruct1
                                                    }
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
                                                    class:"pizo-new-realty-dectruct-content-area-selectbox-child-2",
                                                    props:{
                                                        checked:advanceDetruct2
                                                    }
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
                                                    class:"pizo-new-realty-dectruct-content-area-selectbox-child-3",
                                                    props:{
                                                        checked:advanceDetruct3
                                                    }
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
                                                    class:"pizo-new-realty-dectruct-content-area-selectbox-child-4",
                                                    props:{
                                                        checked:advanceDetruct4
                                                    }
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
        });
        var simpleDetruct = _({
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
                advanceDetruct,
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
                                                value:itemData.bedroom
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
                                                value:itemData.living
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
                                                value:itemData.kitchen
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
                                                value:itemData.toilet
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
            ]
        });
        var tempSelectbox = _({
            tag: "selectmenu",
            class: "pizo-new-realty-detruct-content-structure",
            on:{
                change:function(event)
                {
                    if(this.value==3)
                    advanceDetruct.style.display = "";
                    else
                    advanceDetruct.style.display = "none";
                    if(this.value>=2)
                    simpleDetruct.style.display = "";
                    else
                    simpleDetruct.style.display = "none";
                }
            },
            props: {
                items: [
                   {text:"Chưa xác định",value:0},
                   {text:"Đất trống",value:1},
                   {text:"Cấp 4",value:2},
                   {text:"Sẳn *",value:3},
                ],
                value:itemData.structure
            }
        });
        var elementTemp = _({
            tag: "div",
            class: "pizo-new-realty-dectruct-content-area-size-zone",
            style:{
                pointerEvents:"none"
            },
            child: [
                {
                    tag: "div",
                    class: "pizo-new-realty-desc-detail-row",
                    child: [
                        tempSelectbox
                    ]
                },
                simpleDetruct
            ]})
        tempSelectbox.emit("change");
        itemStructure.push({value:i+1,element:elementTemp.cloneNode(true),simpleDetruct:simpleDetruct});
        if(valueStructure===undefined)
        {
            valueSimpleStructure = simpleDetruct;
            valueStructure = i+1;
        }
        
        itemDirection.push(checkDirection[itemData.direction]);
        if(valueDirection===undefined)
        valueDirection = checkDirection[itemData.direction];
        
        if(checkType[itemData.type])
        {
            itemType.push(checkType[itemData.type].name);
            if(valueType===undefined)
            valueType = checkType[itemData.type].name;
        }
        
        sumRoadWidth += parseFloat(itemData.roadwidth);
        itemRoadWidth.push(itemData.roadwidth);
        if(valueRoadWidth===undefined)
        valueRoadWidth = itemData.roadwidth;
        if(itemData.contact.length>0)
        {
            var tempElement = this.contactItem(itemData.contact[i]);
            itemContact.push({value:false,element:tempElement});
        }
        if(itemData.equipment.length>0)
        {
            itemEquipments.push({value:false,element:this.convenientView(itemData),itemData:itemData.equipment});
        }
    }

  

    itemWidth.push(sumWidth);
    itemHeight.push(sumHeight);
    itemAcreage.push(sumAcreage);
    itemLandarea.push(sumLandarea);
    itemFloorarea.push(sumFloorarea);
    itemRoadWidth.push(sumRoadWidth);


    var dataName =  {
        type: 'text',
        name: 'Tên',
        id: 'name',
        enableEdit:true,
        action: "single-choice",
        value: valueName,
        items: itemName
    }

    var dataAddress =  {
        type: 'text',
        name: 'Địa chỉ',
        id: 'address',
        action: "single-choice",
        value: valueAddress,
        items: itemsAddress,
    }

    var dataAddressOld =  {
        type: 'text',
        name: 'Địa chỉ cũ',
        id: 'address-old',
        action: "single-choice",
        value: valueAddressOld,
        items: itemsAddressOld
    }

    var dataContent =  {
        type: 'text',
        name: 'Mô tả',
        id: 'description',
        enableEdit:true,
        action: "single-choice",
        value: valueContent,
        items: itemContent
    }

    var dataWidth =  {
        type: 'number',
        name: 'Dài (m)',
        id: 'width',
        enableEdit:true,
        action: "single-choice",
        value: valueWidth,
        items: itemWidth
    }

    var dataHeight =  {
        type: 'number',
        name: 'Ngang (m)',
        id: 'height',
        enableEdit:true,
        action: "single-choice",
        value: valueHeight,
        items: itemHeight
    }

    var dataAcreage =  {
        type: 'number',
        name: 'Đất xây dựng (m²)',
        id: 'acreage',
        enableEdit:true,
        action: "single-choice",
        value: valueAcreage,
        items: itemAcreage
    }

    var dataLandarea =  {
        type: 'number',
        name: 'Đất xây dựng (m²)',
        id: 'landarea',
        enableEdit:true,
        action: "single-choice",
        value: valueLandarea,
        items: itemLandarea
    }

    var dataFloorarea =  {
        type: 'number',
        name: 'Đất xây dựng (m²)',
        id: 'floorarea',
        enableEdit:true,
        action: "single-choice",
        value: valueFloorarea,
        items: itemFloorarea
    }

    var dataStructure =  {
        type: 'element',
        name: 'Kết cấu',
        id: 'structure',
        action: "single-choice",
        value: valueStructure,
        items: itemStructure
    }

    var dataDirection =  {
        type: 'text',
        name: 'Hướng',
        id: 'direction',
        action: "single-choice",
        value: valueDirection,
        items: itemDirection
    }

    var dataType =  {
        type: 'text',
        name: 'Loại nhà',
        id: 'type-house',
        action: "single-choice",
        value: valueType,
        items: itemType
    }

    var dataRoadWidth =  {
        type: 'text',
        name: 'Chiều rộng đường vào (m)',
        id: 'roadwidth',
        enableEdit:true,
        action: "single-choice",
        value: valueRoadWidth,
        items: itemRoadWidth
    }

    var dataEquipments =  {
        type: 'element',
        name: 'Tiện ích trong nhà',
        id: 'equipments',
        action: "multi-choice",
        items: itemEquipments
    }

    var dataContact =  {
        type: 'element',
        name: 'Liên hệ',
        id: 'contact',
        action: "multi-choice",
        items: itemContact
    }

    var elementStructure = _({
        tag:"div",
        class:"container-structure"
    })

    var elementEquipments = _({
        tag:"div",
        class:"container-equipments",
        child:[
            self.convenientView({equipment:[]})
        ]
    })

    elementStructure.appendChild(valueSimpleStructure);

    myTool.editor.on("nodechange",function(event){
        switch(event.nodePreviewData.id)
        {
            case "address":
            if(checkAddress[event.nodePreviewData.value])
                element.addMoveMarker(checkAddress[event.nodePreviewData.value])
                break;
            case "structure":
                elementStructure.clearChild();
                elementStructure.appendChild(event.nodePreviewData.item.simpleDetruct)
                break;
            case "equipments":
                elementEquipments.clearChild();
                var result = [];
                var checkEquipment = [],valueTemp;
                for(var i = 0;i<event.nodePreviewData.values.length;i++)
                {
                    for(var j = 0;j<event.nodePreviewData.values[i].itemData.length;j++)
                    {
                        valueTemp = event.nodePreviewData.values[i].itemData[j];
                        if(checkEquipment[valueTemp.equipmentid]===undefined)
                        checkEquipment[valueTemp.equipmentid] = {equipmentid:valueTemp.equipmentid,content:parseInt(valueTemp.content)};
                        else
                        checkEquipment[valueTemp.equipmentid].content += parseInt(valueTemp.content);
                    }
                }
                for(var param in checkEquipment)
                {
                    result.push(checkEquipment[param]);
                }
                elementEquipments.appendChild(self.convenientView({equipment:result}));
        }
    })

    myTool.setData(
        {
            editor: {
                title: 'Thông tin bất động sản sau gộp',
                properties: [
                    {
                        type:"container",
                        id:"container-general",
                        properties:[
                            {
                                type: 'constant',
                                id: 'GPS',
                                action: 'const',
                                element:element
                            },
                            {
                                type:"group",
                                name: 'Thông tin chung',
                                id:"general",
                                properties: [
                                    dataName,
                                    dataAddress, 
                                    dataAddressOld,
                                    dataContent
                                ]
                            },
                            {
                                type:"group",
                                name: 'Thông tin xây dựng',
                                id:"construction",
                                properties: [
                                    dataWidth,
                                    dataHeight,
                                    dataAcreage,
                                    dataLandarea,
                                    dataFloorarea,
                                    dataStructure,
                                    {
                                        type: 'constant',
                                        id: 'structure-detail',
                                        changeid:'structure',
                                        action: 'const',
                                        element:elementStructure
                                    },
                                    dataDirection,
                                    dataType,
                                    dataRoadWidth
                                ]
                            },
                        ]
                    },
                    {
                        type:"container",
                        id:"container-orther",
                        properties:[
                            dataEquipments,
                            {
                                type: 'constant',
                                id: 'equipments-detail',
                                changeid:'equipments',
                                action: 'const',
                                element:elementEquipments
                            }
                        ]
                    },
                    {
                        type:"container",
                        id:"container-contact",
                        properties:[
                            dataContact
                        ]
                    }
                    // {
                    //     type:"container",
                    //     id:"container-general",
                    // }
                ]
            }
        }
    );
    toolView.addStyle({ width: '100%', height: '100%' });
    this.$view.addChild(_({
            tag:"div",
            class:["pizo-list-realty-main"],
            child:[
                {
                    tag:"div",
                    class:["pizo-list-realty-main-result-control"],
                    child:[
                        toolView
                    ]
                }
            ]   
        })
        );
    this.createPromise();
    return this.$view;
}

MergeRealty.prototype.contactItem = function(data){
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
                                if(tempData.password!==undefined)
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

MergeRealty.prototype.editAccount = function(node,data)
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

MergeRealty.prototype.editDBAccount = function(mNewAccount,data,node){
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

MergeRealty.prototype.editViewAccount = function(value,node){
    node.setInformation(value);
}

MergeRealty.prototype.editDBContact = function(mNewContact,data,node){
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

MergeRealty.prototype.editViewContact = function(value,node){
    node.setInformation(value);
}

MergeRealty.prototype.editContact = function(node,data)
{
    var self = this;
    var mNewContact = new NewContact({original:data});
    mNewContact.attach(self.parent);
    var frameview = mNewContact.getView();
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDBContact(mNewContact,data,node);
}

MergeRealty.prototype.convenientView = function (dataHouse) {
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
        for(var i = 0;i<dataHouse.equipment.length;i++)
        {
            temp = libary[dataHouse.equipment[i].equipmentid];
            temp.content = dataHouse.equipment[i].content;
            value.push(dataHouse.equipment[i].equipmentid);
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
    return temp;
}

MergeRealty.prototype.itemCount = function(data)
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

MergeRealty.prototype.itemDisplayNone = function(data)
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

MergeRealty.prototype.getDataSave = function() {
    var temp = {
        name:this.name.value,
        type:this.type.value,
        nationid:this.nation.value
    }
    if(this.data!==undefined)
    temp.id = this.data.original.id;
    return temp;
}

MergeRealty.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

MergeRealty.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

MergeRealty.prototype.flushDataToView = function () {
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

MergeRealty.prototype.start = function () {

}

export default MergeRealty;