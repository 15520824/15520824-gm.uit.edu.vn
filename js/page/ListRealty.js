import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListRealty.css"
import R from '../R';
import Fcore from '../dom/Fcore';

import { input_choicenumber,tableView, ModuleView} from '../component/ModuleView';
import NewRealty from '../component/NewRealty';

var _ = Fcore._;
var $ = Fcore.$;

function ListRealty() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.ModuleView = new ModuleView();
    
    this.NewRealty = new NewRealty();
    this.NewRealty.attach(this);
}

ListRealty.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(ListRealty.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListRealty.prototype.constructor = ListRealty;

ListRealty.prototype.getView = function () {
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
            placeholder:"Tìm theo mã, tên, địa chỉ bất động sản"
        }
    });
    if(window.mobilecheck())
    {
        allinput.placeholder = "Tìm bất động sản"
    }
    this.$view = _({
        tag: 'singlepage',
        class: "pizo-list-realty",
        child: [
            {
                class: 'absol-single-page-header',
                child: [
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
                                        var mNewRealty = new NewRealty();
                                        mNewRealty.attach(self.parent);
                                        console.log(self.parent)
                                        var frameview = mNewRealty.getView();
                                        self.parent.body.addChild(frameview);
                                        self.parent.body.activeFrame(frameview);
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
                                    },
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-page-allinput-filter",
                                on:{
                                    click:function(event)
                                    {
                                        self.searchControl.show();
                                    }
                                },
                                child:[
                                    {
                                        tag: 'filter-ico',
                                    },
                                    {
                                        tag:"span",
                                        class:"navbar-search__filter-text",
                                        props:{
                                            innerHTML:"Lọc"
                                        }
                                    }
                                ]
                            },
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
                    var mNewRealty = new NewRealty();
                    mNewRealty.attach(self.parent);
                    console.log(self.parent)
                    var frameview = mNewRealty.getView();
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
    var child = [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""];
    child.child = [[{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""]]
    var header = [{ type: "dragzone" , dragElement : false},{ type: "increase", value: "#"}, {value:'MS',sort:true}, 'Số nhà', {value: 'Tên đường' }, { value:'Phường/Xã' }, { value: 'Quận/Huyện' }, { value: 'Tỉnh/TP' }, { value: 'Ghi chú', sort: true }, {value: 'Ngang', sort: true }, {value: 'Dài',sort:true}, {value: 'DT' }, { value: 'Kết cấu' }, { value: 'Hướng'}, 'Giá', { value: 'Giá m<sup>2</sup>' }, { value: 'Hiện trạng'}, {value:'Ngày tạo'},{type:"detail", functionClickAll:functionClickMore,icon:"",dragElement : false}];
    var dataTable = [
        child,
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
  
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, "10", "168/6B", "Xô Viết Nghệ Tĩnh", "P. 25","Q. Bình Thạnh","Hà nội", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],
    [{}, {}, 5, "168/6B", "Xô Viết Nghệ Tĩnh", "P. 26", "Q. Bình Thạnh", "TP. Hồ Chí Minh", "...", 5.5, 13, 53, "2 tầng + sân thượng", "Bắc", "9.1 tỷ", "172,000", "Còn bán", "15:48 03/03/2020",""],

]

    tableViewX = tableView(header, dataTable,true,true,2);
    tableViewX.addInputSearch($('.pizo-list-realty-page-allinput-container input',this.$view));
    tableViewX.setArrayScroll(2);
    this.searchControl = this.searchControlContent();

    this.$view.addChild(_({
            tag:"div",
            class:["pizo-list-realty-main"],
            child:[
                this.searchControl,
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

ListRealty.prototype.searchControlContent = function(){
    var startDay,endDay;

    startDay = _(
        {
            tag: 'calendar-input',
            data: {
                anchor: 'top',
                value: new Date(),
                maxDateLimit: new Date()
            },
            on: {
                changed: function (date) {
                    console.log(endDay)
                    endDay.minDateLimit = date;
                }
            }
        }
    )

    endDay = _(
        {
            tag: 'calendar-input',
            data: {
                anchor: 'top',
                value: new Date(),
                minDateLimit: new Date()
            },
            on: {
                changed: function (date) {
                    console.log(date)
                    startDay.maxDateLimit = date;
                }
            }
        }
    )
    var content = _({
        tag:"div",
        class:"pizo-list-realty-main-search-control-container",
        on:{
            click:function(event)
            {
                event.stopPropagation();
            }
        },
        child:[
            {
                tag:"div",
                class:"pizo-list-realty-main-search-control-container-scroller",
                child:[
                    {
                        tag:"div",
                        class:"pizo-list-realty-main-search-control-row",
                        child:[
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-date",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-date-label",
                                        props:{
                                            innerHTML:"Thời gian"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-date-input",
                                        child:[
                                            startDay,
                                            endDay
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-price",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-price-label",
                                        props:{
                                            innerHTML:"Khoảng giá"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-price-input",
                                        child:[
                                            {
                                                tag:"input",
                                                class:"pizo-list-realty-main-search-control-row-price-input-low",
                                                props:{
                                                    type:"number",
                                                    autocomplete:"off",
                                                    placeholder:"đ Từ",
                                                }
                                            },
                                            {
                                                tag:"input",
                                                class:"pizo-list-realty-main-search-control-row-price-input-high",
                                                props:{
                                                    type:"number",
                                                    autocomplete:"off",
                                                    placeholder:"đ Đến",
                                                }
                                            },
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-phone",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-phone-label",
                                        props:{
                                            innerHTML:"Số điện thoại"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-phone-input",
                                        child:[
                                            {
                                                tag:"input",
                                                props:{
                                                    type:"number",
                                                    autocomplete:"off"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-button",
                                child:[
                                    {
                                        tag: "button",
                                        class: ["pizo-list-realty-button-apply","pizo-list-realty-button-element"],
                                        on: {
                                            click: function (evt) {
        
                                            }
                                        },
                                        child: [
                                        '<span>' + "Áp dụng" + '</span>'
                                        ]
                                    },
                                    {
                                        tag: "button",
                                        class: ["pizo-list-realty-button-deleteall","pizo-list-realty-button-element"],
                                        on: {
                                            click: function (evt) {
                                                temp.reset();
                                            }
                                        },
                                        child: [
                                        '<span>' + "Thiết lập lại" + '</span>'
                                        ]
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        tag:"div",
                        class:"pizo-list-realty-main-search-control-row",
                        child:[
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-MS",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-MS-label",
                                        props:{
                                            innerHTML:"Mã số"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-MS-input",
                                        child:[
                                            {
                                                tag:"input",
                                                props:{
                                                    type:"number",
                                                    autocomplete:"off"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-SN",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-SN-label",
                                        props:{
                                            innerHTML:"Số nhà"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-SN-input",
                                        child:[
                                            {
                                                tag:"input",
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-TD",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-TD-label",
                                        props:{
                                            innerHTML:"Tên đường"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-TD-input",
                                        child:[
                                            {
                                                tag:"input",
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-PX",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-PX-label",
                                        props:{
                                            innerHTML:"Phường/Xã"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-PX-input",
                                        child:[
                                            {
                                                tag:"input",
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-QH",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-QH-label",
                                        props:{
                                            innerHTML:"Quận huyện"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-QH-input",
                                        child:[
                                            {
                                                tag:"input",
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-TT",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-TT-label",
                                        props:{
                                            innerHTML:"Tỉnh/TP"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-TT-input",
                                        child:[
                                            {
                                                tag:"input"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-HT",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-HT-label",
                                        props:{
                                            innerHTML:"Tình trạng"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-HT-input",
                                        child:[
                                            {
                                                tag:"selectmenu",
                                                props:{
                                                    items:[
                                                        {text:"Tất cả",value:0},
                                                        {text:"Còn bán",value:1},
                                                        {text:"Đã bán",value:2},
                                                        {text:"Ngưng bán",value:3},
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
    var temp = _({
        tag:"div",
        class:"pizo-list-realty-main-search-control",
        on:{
            click:function(event)
            {
                this.hide();
            }
        },
        child:[
            content
        ]
    })

    temp.content = content;
    content.timestart = startDay;
    content.timeend = endDay;
    content.lowprice = $('input.pizo-list-realty-main-search-control-row-price-input-low',content);
    content.highprice = $('input.pizo-list-realty-main-search-control-row-price-input-high',content);
    content.phone = $('.pizo-list-realty-main-search-control-row-phone-input input',content);
    content.MS = $('.pizo-list-realty-main-search-control-row-MS-input input',content);
    content.SN = $('.pizo-list-realty-main-search-control-row-SN input',content);
    content.TD = $('.pizo-list-realty-main-search-control-row-TD input',content);
    content.PX = $('.pizo-list-realty-main-search-control-row-PX input',content);
    content.QH = $('.pizo-list-realty-main-search-control-row-QH input',content);
    content.HT = $('.pizo-list-realty-main-search-control-row-HT input',content);

    temp.show = function()
    {
        if(!temp.classList.contains("showTranslate"))
        temp.classList.add("showTranslate");
    }
    temp.hide = function()
    {
        if(!content.classList.contains("hideTranslate"))
            content.classList.add("hideTranslate");
        var eventEnd = function(){
            if(temp.classList.contains("showTranslate"))
            temp.classList.remove("showTranslate");
            content.classList.remove("hideTranslate");
            content.removeEventListener("webkitTransitionEnd",eventEnd);
            content.removeEventListener("transitionend",eventEnd);
        };
        // Code for Safari 3.1 to 6.0
        content.addEventListener("webkitTransitionEnd", eventEnd);

        // Standard syntax
        content.addEventListener("transitionend", eventEnd);
    }
    temp.apply = function()
    {

    }
    temp.reset = function()
    {
        content.timestart = new Date();
        content.timeend = new Date();
        content.lowprice.value = "";
        content.highprice.value = "";
        content.phone.value = "";
        content.MS.value = "";
        content.SN.value = "";
        content.TD.value = "";
        content.PX.value = "";
        content.QH.value = "";
        content.TT.value = "";
        content.HT.value = 0;
    }

  
    return temp;
}

ListRealty.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListRealty.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

ListRealty.prototype.flushDataToView = function () {
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

ListRealty.prototype.start = function () {

}

export default ListRealty;