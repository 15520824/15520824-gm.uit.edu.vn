import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/MergeRealty.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import MergeTool from 'mpot-merge-tool';
import moduleDatabase from '../component/ModuleDatabase';
import { MapView } from "./MapView";

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
    this.checkAddress = moduleDatabase.getModule("addresses").getLibary("id");
    this.checkStreet = moduleDatabase.getModule("streets").getLibary("id");
    this.checkWard = moduleDatabase.getModule("wards").getLibary("id");
    this.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");
    this.checkState = moduleDatabase.getModule("states").getLibary("id");
    var number,street,ward,district,state,fullAddress;
    var checkAddress = [];
    var valueStructure,itemStructure = [];
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
            elementTemp.simpleDetruct = simpleDetruct;
        tempSelectbox.emit("change");
        itemStructure.push({value:i+1,element:elementTemp});
        if(valueStructure===undefined)
        valueStructure = i+1;
    }

  

    itemWidth.push(sumWidth);
    itemHeight.push(sumHeight);
    itemAcreage.push(sumAcreage);
    itemLandarea.push(sumLandarea);
    itemFloorarea.push(sumFloorarea);



    var dataName =  {
        type: 'text',
        name: 'Tên',
        id: 'name',
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
        action: "single-choice",
        value: valueContent,
        items: itemContent
    }

    var dataWidth =  {
        type: 'text',
        name: 'Dài (m)',
        id: 'width',
        action: "single-choice",
        value: valueWidth,
        items: itemWidth
    }

    var dataHeight =  {
        type: 'text',
        name: 'Ngang (m)',
        id: 'height',
        action: "single-choice",
        value: valueHeight,
        items: itemHeight
    }

    var dataAcreage =  {
        type: 'text',
        name: 'Đất xây dựng (m²)',
        id: 'acreage',
        action: "single-choice",
        value: valueAcreage,
        items: itemAcreage
    }

    var dataLandarea =  {
        type: 'text',
        name: 'Đất xây dựng (m²)',
        id: 'landarea',
        action: "single-choice",
        value: valueLandarea,
        items: itemLandarea
    }

    var dataFloorarea =  {
        type: 'text',
        name: 'Đất xây dựng (m²)',
        id: 'floorarea',
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


    var elementStructure = _({
        tag:"div",
        class:"container-structure"
    })

    myTool.editor.on("nodechange",function(event){
        switch(event.nodePreviewData.id)
        {
            case "address":
            if(checkAddress[event.nodePreviewData.value])
                element.addMoveMarker(checkAddress[event.nodePreviewData.value])
                break;
            case "structure":
                elementStructure.clearChild();
                elementStructure.appendChild(event.nodePreviewData.item.element.simpleDetruct.cloneNode(true))
                break;
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
                                    dataStructure
                                ]
                            },
                            {
                                type: 'constant',
                                id: 'structure-detail',
                                action: 'const',
                                element:elementStructure
                            }
                        ]
                    }
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