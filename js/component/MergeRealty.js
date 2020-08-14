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
        
    this.textHeader = "Sửa ";
    this.data = data;

    if(this.data ==undefined)
    this.textHeader = "Thêm ";
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
                            innerHTML:  self.textHeader+"Tỉnh/TP"
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
    var itemData;
    var valueAddress,valueAddressOld;
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
        number = this.checkAddress[itemData.addressid].addressnumber;
        street = this.checkStreet[this.checkAddress[itemData.addressid].streetid].name;
        ward = this.checkWard[this.checkAddress[itemData.addressid].wardid].name;
        district = this.checkDistrict[this.checkWard[this.checkAddress[itemData.addressid].wardid].districtid].name;
        state = this.checkState[this.checkDistrict[this.checkWard[this.checkAddress[itemData.addressid].wardid].districtid].stateid].name;
        fullAddress = number+" "+street+", "+ward+", "+district+", "+state;
        itemsAddress.push(fullAddress);
        if(valueAddress===undefined)
        valueAddress = fullAddress;

        //Địa chỉ cũ
        // if(itemData.addressid!==0)
        // number = this.checkAddress[itemData.addressid].addressnumber;
        // street = this.checkStreet[this.checkAddress[itemData.addressid].streetid].name;
        // ward = this.checkWard[this.checkAddress[itemData.addressid].wardid].name;
        // district = this.checkDistrict[this.checkWard[this.checkAddress[itemData.addressid].wardid].districtid].name;
        // state = this.checkState[this.checkDistrict[this.checkWard[this.checkAddress[itemData.addressid].wardid].districtid].stateid].name;
        // fullAddress = number+" "+street+", "+ward+", "+district+", "+state;
        // itemsAddress.push(fullAddress);
        // if(valueAddressOld===undefined)
        // valueAddressOld = fullAddress;
    }
    var dataAddress =  {
        type: 'text',
        name: 'Địa chỉ',
        id: 'address',
        action: "single-choice",
        value: valueAddress,
        items: itemsAddress
    }

    myTool.setData(
        {
            editor: {
                title: 'Quản lý bất động sản',
                properties: [
                    dataAddress,
                    {
                        type: 'text',
                        name: 'Tên',
                        id: 'name',
                        action: 'input',
                        placeholder: "Nguyễn Văn An"
                    },
                    {
                        type: 'text',
                        name: 'MSSV',
                        id: 'stid',
                        action: 'input',
                        value: '5130abcd'
                    },
                    {
                        type: 'number',
                        name: 'Tuổi',
                        id: 'old',
                        action: "single-choice",
                        value: 20,
                        items: [15, 16, 17, 18, 19, 20, 21, 22, 25]
                    },
                    {
                        type: 'number',
                        name: 'Tháng trong năm',
                        id: 'months',
                        action: "multi-choice",
                        values: [],
                        items: Array(12).fill(0).map((u, i) => i + 1)
                    },
                    {
                        type: 'text',
                        name: 'Giới tính',
                        id: 'sx',
                        action: 'single-choice',
                        items: [
                            'Nam', "Nữ"
                        ],
                        value: 'Nam'
                    },
                    {
                        type: 'text',
                        name: 'Ngôn ngữ',
                        id: 'lang',
                        action: 'multi-choice',
                        items: ['English', 'Tiếng Việt', "Javascript"]
                    },
                    {
                        type: 'group',
                        name: 'Thông tin liên lạc',
                        id: 'contact',
                        properties: [
                            {
                                type: 'text',
                                long: true,
                                id: 'address',
                                name: 'Địa chỉ',
                                action: 'input'
                            },
                            {
                                type: 'text',
                                name: 'SĐT',
                                id: 'phone',
                                action: 'input'
                            }
                        ]
                    },
                    {
                        type: 'group',
                        name: 'Nguời bảo hộ',
                        id: 'tutor',
                        properties: [
                            {
                                type: 'text',
                                action: 'input',
                                name: 'Địa chỉ',
                                long: true,
                                fName: 'Địa chỉ(người bảo hộ)',
                                id: 'tutor_address'
                            },
                            {
                                type: 'text',
                                name: 'SĐT(người bảo hộ)',
                                id: 'tutor_phone',
                                action: 'input'
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