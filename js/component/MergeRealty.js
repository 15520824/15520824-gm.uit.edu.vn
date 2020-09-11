import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/MergeRealty.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import MergeTool from 'absol-form';
import moduleDatabase from '../component/ModuleDatabase';

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
    var toolView = myTool.getView();
    var itemsAddress = [];
    var itemsAddressOld = [];
    var itemData;
    var valueAddress,valueAddressOld;
    var valueName,itemName = [];
    var valueContent,itemContent = [];
    var valueWidth,itemWidth = [];
    var valueHeight,itemHeight = [];
    var valueAcreage,itemAcreage = [];
    var valueLandarea,itemLandarea = [];
    var valueFloorarea,itemFloorarea = [];
    this.checkAddress = moduleDatabase.getModule("addresses").getLibary("id");
    this.checkStreet = moduleDatabase.getModule("streets").getLibary("id");
    this.checkWard = moduleDatabase.getModule("wards").getLibary("id");
    this.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");
    this.checkState = moduleDatabase.getModule("states").getLibary("id");
    var number,street,ward,district,state,fullAddress;

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
            if(valueAddress===undefined)
            valueAddress = fullAddress;
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

        itemWidth.push(itemData.width);
        if(valueWidth===undefined)
        valueWidth = itemData.width;

        itemHeight.push(itemData.height);
        if(valueHeight===undefined)
        valueHeight = itemData.height;

        itemAcreage.push(itemData.acreage);
        if(valueAcreage===undefined)
        valueAcreage = itemData.acreage;

        itemLandarea.push(itemData.landarea);
        if(valueLandarea===undefined)
        valueLandarea = itemData.landarea;

        itemFloorarea.push(itemData.floorarea);
        if(valueFloorarea===undefined)
        valueFloorarea = itemData.floorarea;
    }

    var dataName =  {
        type: 'text',
        name: 'Tên',
        id: 'address',
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
        items: itemsAddress
    }

    var dataAddressOld =  {
        type: 'text',
        name: 'Địa chỉ cũ',
        id: 'address',
        action: "single-choice",
        value: valueAddressOld,
        items: itemsAddressOld
    }

    var dataContent =  {
        type: 'text',
        name: 'Mô tả',
        id: 'address',
        action: "single-choice",
        value: valueContent,
        items: itemContent
    }

    var dataWidth =  {
        type: 'text',
        name: 'Dài',
        id: 'width',
        action: "single-choice",
        value: valueWidth,
        items: itemWidth
    }

    var dataHeight =  {
        type: 'text',
        name: 'Ngang',
        id: 'height',
        action: "single-choice",
        value: valueHeight,
        items: itemHeight
    }

    var dataAcreage =  {
        type: 'text',
        name: 'Đất xây dựng',
        id: 'height',
        action: "single-choice",
        value: valueAcreage,
        items: itemAcreage
    }

    var dataLandarea =  {
        type: 'text',
        name: 'Đất xây dựng',
        id: 'height',
        action: "single-choice",
        value: valueLandarea,
        items: itemLandarea
    }

    var dataLandarea =  {
        type: 'text',
        name: 'Đất xây dựng',
        id: 'height',
        action: "single-choice",
        value: valueFloorarea,
        items: itemFloorarea
    }

    myTool.setData(
        {
            editor: {
                title: 'Thông tin bất động sản sau gộp',
                properties: [
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
                            dataAcreage
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