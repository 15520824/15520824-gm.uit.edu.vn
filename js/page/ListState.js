import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListState.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { formatDate } from '../component/FormatFunction';

import { input_choicenumber,tableView, ModuleView} from '../component/ModuleView';
import NewState from '../component/NewState';

var _ = Fcore._;
var $ = Fcore.$;

function ListState() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.ModuleView = new ModuleView();

}

ListState.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(ListState.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListState.prototype.constructor = ListState;

ListState.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
    var input = _({
        tag:"input",
        class:"quantumWizTextinputPaperinputInput",
        props:{
            type:"number",
            autocomplete:"off",
            min:1,
            max:200,
            step:1,
            value:50
        }
    })
    var allinput = _({
        tag:"input",
        class:"pizo-list-realty-page-allinput-input",
        props:{
            placeholder:"Tên"
        }
    });
    if(window.mobilecheck())
    {
        allinput.placeholder = "Tên"
    }
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
                            innerHTML: "Quản lý Tỉnh/TP"
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
                                        var frameAdd = self.NewRealty.getView();
                                        self.parent.body.addChild(frameAdd);
                                        self.parent.body.activeFrame(frameAdd);
                                        self.NewRealty.setContainer(self.parent);
                                    }
                                },
                                child: [
                                '<span>' + "Thêm" + '</span>'
                                ]
                            }
                        ]
                    },
                    {
                        tag:"div",
                        class:"pizo-list-realty-page-allinput",
                        child:[
                            {
                                tag:"div",
                                class:"pizo-list-realty-page-allinput-container",
                                child:[
                                    allinput,
                                    {
                                        tag:"button",
                                        class:"pizo-list-realty-page-allinput-search",
                                        child:[
                                            {
                                                tag: 'i',
                                                class: 'material-icons',
                                                props: {
                                                    innerHTML: 'search'
                                                },
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag: "div",
                        class: "pizo-list-realty-page-number-line",
                        child: [
                            input,
                            {
                                tag: "span",
                                class:
                                    "freebirdFormeditorViewAssessmentWidgetsPointsLabel",
                                props: {
                                    innerHTML: "Số dòng"
                                }
                            }
                        ]
                    }
                ]
            },
        ]
    });
    var tableViewX;
    var docTypeMemuProps,token,functionX;
    var functionClickMore = function(event, me, index, parent, data, row)
    {
       
        docTypeMemuProps = {
            items: [
                {
                    text: 'Sửa',
                    icon: 'span.mdi.mdi-text-short',
                    value:0,
                },
                {
                    text: 'Xóa',
                    icon: 'span.mdi.mdi-text',
                    value:1,
                },
            ]
        };
        token = absol.QuickMenu.show(me, docTypeMemuProps, [3,4], function (menuItem) {
            switch(menuItem.value)
            {
                case 0:
                    var mNewState = new NewState();
                    mNewState.attach(self.parent);
                    console.log(self.parent)
                    var frameview = mNewState.getView();
                    self.parent.body.addChild(frameview);
                    self.parent.body.activeFrame(frameview);
                    break;
                case 1:
                    break;
            }
        });

        functionX = function(token){
            return function(){
                var x = function(event){
                    absol.QuickMenu.close(token);
                    document.body.removeEventListener("click",x);
                }
                document.body.addEventListener("click",x)
            }
        }(token);

        setTimeout(functionX,10)
    }
    var header = [{ type: "dragzone" , dragElement : false},{ type: "increase", value: "#"}, {value:'ID',sort:true}, {value:'Tên',sort:true}, {value: 'Ngày tạo',sort:true }, { value:'Ngày cập nhật', sort:true }, {type:"detail",functionClickAll:functionClickMore,dragElement : false}];
    var dataTable = [
        [{},{},'79','Thành phố Hồ Chí Minh', formatDate("2020-04-21T04:25:21.769Z",true,true,true,true,true),	formatDate("2020-04-21T04:25:21.769Z",true,true,true,true,true),{}],
        [{},{},'80','Thủ đô Hà Nội', formatDate("2020-04-21T04:25:21.769Z",true,true,true,true,true),	formatDate("2020-04-21T04:25:21.769Z",true,true,true,true,true),{}]
    ];

    tableViewX = tableView(header, dataTable,true,true,2);
    tableViewX.addInputSearch($('.pizo-list-realty-page-allinput-container input',this.$view))

    this.$view.addChild(_({
            tag:"div",
            class:["pizo-list-realty-main"],
            child:[
                {
                    tag:"div",
                    class:["pizo-list-realty-main-result-control","drag-zone-bg"],
                    child:[
                        tableViewX
                    ]
                }
            ]   
        })
        );
    return this.$view;
}

ListState.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListState.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

ListState.prototype.flushDataToView = function () {
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

ListState.prototype.start = function () {

}

export default ListState;